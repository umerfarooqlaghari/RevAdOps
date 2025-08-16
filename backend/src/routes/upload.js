import express from 'express';
import multer from 'multer';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { authenticateToken } from '../middleware/auth.js';
import prisma from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Test Cloudinary configuration
router.get('/test-cloudinary', authenticateToken, (req, res) => {
  try {
    if (isCloudinaryConfigured) {
      res.json({
        status: 'configured',
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        message: 'Cloudinary is properly configured'
      });
    } else {
      res.json({
        status: 'not_configured',
        message: 'Cloudinary credentials are missing or invalid'
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking Cloudinary config', error: error.message });
  }
});

// Admin middleware
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`File type .${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
  }
});

// Test Cloudinary credentials with a simple API call
router.get('/test-credentials', authenticateToken, async (req, res) => {
  try {
    if (isCloudinaryConfigured) {
      // Test Cloudinary API with a simple call
      const result = await cloudinary.api.ping();
      res.json({
        message: 'Cloudinary credentials are valid',
        status: result.status,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME
      });
    } else {
      res.status(400).json({ message: 'Cloudinary not configured' });
    }
  } catch (error) {
    console.error('Cloudinary credentials test error:', error);
    res.status(500).json({
      message: 'Cloudinary credentials test failed',
      error: error.message,
      details: error
    });
  }
});

// Test upload with simple configuration
router.post('/test-upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (isCloudinaryConfigured) {
      // Simple test upload to Cloudinary with no options
      const result = await cloudinary.uploader.upload_stream(
        {}, // Empty options to avoid signature issues
        (error, result) => {
          if (error) {
            console.error('Test upload error:', error);
            return res.status(500).json({ message: 'Upload failed', error: error.message });
          }
          res.json({
            message: 'Test upload successful',
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      ).end(req.file.buffer);
    } else {
      res.status(400).json({ message: 'Cloudinary not configured' });
    }
  } catch (error) {
    console.error('Test upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Upload single image
router.post('/image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let result;

    if (isCloudinaryConfigured) {
      // Upload to Cloudinary with absolute minimal configuration
      result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            // Only specify the bare minimum to avoid signature issues
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              console.log('Cloudinary upload success:', result.secure_url);
              resolve(result);
            }
          }
        ).end(req.file.buffer);
      });

      res.json({
        message: 'Image uploaded successfully',
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height
      });
    } else {
      // Fallback: Use local file storage
      const uploadsDir = path.join(__dirname, '../../uploads/images');

      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const extension = path.extname(req.file.originalname);
      const filename = `${timestamp}-${Math.random().toString(36).substring(7)}${extension}`;
      const filepath = path.join(uploadsDir, filename);

      // Save file locally
      fs.writeFileSync(filepath, req.file.buffer);

      // Return local URL
      const localUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/uploads/images/${filename}`;

      res.json({
        message: 'Image uploaded successfully (local storage)',
        url: localUrl,
        publicId: filename,
        width: null,
        height: null,
        note: 'Using local storage - configure Cloudinary for production use'
      });
    }
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Upload multiple images
router.post('/images', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(file => 
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'gunaselaan',
            transformation: [
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              originalName: file.originalname
            });
          }
        ).end(file.buffer);
      })
    );

    const results = await Promise.all(uploadPromises);

    res.json({
      message: 'Images uploaded successfully',
      images: results
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Delete image from Cloudinary
router.delete('/image', authenticateToken, async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ message: 'Public ID is required' });
    }

    // Decode the public ID (it might be URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);

    const result = await cloudinary.uploader.destroy(decodedPublicId);

    if (result.result === 'ok') {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found or already deleted' });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

// Get image transformation URL
router.post('/transform', authenticateToken, async (req, res) => {
  try {
    const { publicId, transformations } = req.body;

    if (!publicId) {
      return res.status(400).json({ message: 'Public ID is required' });
    }

    // Generate transformed URL
    const transformedUrl = cloudinary.url(publicId, {
      ...transformations,
      secure: true
    });

    res.json({
      originalUrl: cloudinary.url(publicId, { secure: true }),
      transformedUrl
    });
  } catch (error) {
    console.error('Transform image error:', error);
    res.status(500).json({ message: 'Transform failed', error: error.message });
  }
});

// Get all uploaded images (admin)
router.get('/images', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const maxResults = Math.min(parseInt(limit), 100); // Limit to 100 max

    const result = await cloudinary.search
      .expression('folder:gunaselaan')
      .sort_by([['created_at', 'desc']])
      .max_results(maxResults)
      .execute();

    res.json({
      images: result.resources.map(resource => ({
        publicId: resource.public_id,
        url: resource.secure_url,
        width: resource.width,
        height: resource.height,
        format: resource.format,
        bytes: resource.bytes,
        createdAt: resource.created_at
      })),
      totalCount: result.total_count
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ message: 'Failed to fetch images', error: error.message });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files' });
    }
  }
  
  if (error.message.includes('File type')) {
    return res.status(400).json({ message: error.message });
  }

  next(error);
});

// Admin upload with enhanced constraints
router.post('/admin/image', authenticateToken, adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const { maxWidth = 2000, maxHeight = 2000, quality = 'auto', section, key } = req.body;

    // Upload to Cloudinary with minimal configuration to avoid signature issues
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'revadops'
          // Removed transformations and format to avoid signature issues
        },
        (error, result) => {
          if (error) {
            console.error('Admin image upload error:', error);
            reject(error);
          } else {
            console.log('Admin image upload success:', result.secure_url);
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    // Save to database
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        filename: result.public_id,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        width: result.width,
        height: result.height,
        cloudinaryId: result.public_id,
        cloudinaryUrl: result.secure_url,
        folder: 'revadops/admin',
        tags: req.body.tags ? req.body.tags.split(',') : [],
        altText: req.body.altText || ''
      }
    });

    res.json({
      message: 'Image uploaded successfully',
      asset: mediaAsset,
      url: result.secure_url
    });
  } catch (error) {
    console.error('Admin image upload error:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

// Get all media assets for admin
router.get('/admin/assets', authenticateToken, adminAuth, async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const where = type ? { mimeType: { startsWith: type } } : {};

    const assets = await prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.mediaAsset.count({ where });

    res.json({
      assets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin assets error:', error);
    res.status(500).json({ message: 'Failed to fetch assets' });
  }
});

// Delete media asset
router.delete('/admin/assets/:id', authenticateToken, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const asset = await prisma.mediaAsset.findUnique({
      where: { id }
    });

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(asset.cloudinaryId, {
      resource_type: asset.mimeType.startsWith('video/') ? 'video' : 'image'
    });

    // Delete from database
    await prisma.mediaAsset.delete({
      where: { id }
    });

    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Delete admin asset error:', error);
    res.status(500).json({ message: 'Failed to delete asset' });
  }
});

export default router;
