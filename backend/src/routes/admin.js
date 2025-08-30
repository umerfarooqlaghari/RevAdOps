import express from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check admin role
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// SPECIFIC ROUTES FIRST - Get all content for homepage sections
router.get('/homepage/all', authenticateToken, adminAuth, async (req, res) => {
  try {
    const sections = [
      'homepage_hero',
      'homepage_what_we_do',
      'homepage_why_choose',
      'homepage_how_it_works',
      'homepage_expertise',
      'homepage_testimonials',
      'homepage_final_cta'
    ];

    const content = await prisma.content.findMany({
      where: {
        section: { in: sections },
        isActive: true
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' }
      ]
    });

    // Group content by section
    const groupedContent = content.reduce((acc, item) => {
      const sectionName = item.section.replace('homepage_', '');
      if (!acc[sectionName]) {
        acc[sectionName] = [];
      }
      acc[sectionName].push(item);
      return acc;
    }, {});

    res.json({ content: groupedContent });
  } catch (error) {
    console.error('Get homepage content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk update homepage content - SPECIFIC ROUTE
router.put('/homepage/bulk', [
  authenticateToken,
  adminAuth,
  body('updates').isArray().withMessage('Updates must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { updates } = req.body;
    const results = [];

    for (const update of updates) {
      const { section, key, value, type = 'text', metadata = {}, order = 0 } = update;

      try {
        const content = await prisma.content.upsert({
          where: {
            section_key: {
              section: `homepage_${section}`,
              key: key
            }
          },
          update: {
            value,
            type,
            metadata,
            order,
            updatedAt: new Date()
          },
          create: {
            section: `homepage_${section}`,
            key,
            value,
            type,
            metadata,
            order
          }
        });

        results.push({ success: true, content });
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          section,
          key
        });
      }
    }

    res.json({
      message: 'Bulk update completed',
      results
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PARAMETERIZED ROUTES AFTER SPECIFIC ROUTES
// Get all content for a specific page
router.get('/content/:page', authenticateToken, adminAuth, async (req, res) => {
  try {
    const { page } = req.params;

    const content = await prisma.content.findMany({
      where: {
        section: page,
        isActive: true
      },
      orderBy: { order: 'asc' }
    });

    res.json({ content });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific content by section and key
router.get('/content/:page/:section/:key', authenticateToken, adminAuth, async (req, res) => {
  try {
    const { page, section, key } = req.params;
    
    const content = await prisma.content.findUnique({
      where: { 
        section_key: {
          section: `${page}_${section}`,
          key: key
        }
      }
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ content });
  } catch (error) {
    console.error('Get specific content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update or create content
router.put('/content/:page/:section/:key', [
  authenticateToken,
  adminAuth,
  body('value').notEmpty().withMessage('Content value is required'),
  body('type').optional().isIn(['text', 'image', 'video', 'json']).withMessage('Invalid content type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page, section, key } = req.params;
    const { value, type = 'text', metadata = {}, order = 0 } = req.body;

    const sectionKey = `${page}_${section}`;

    // Validate content based on type
    if (type === 'image') {
      // Validate image constraints
      const { width, height, maxSize } = metadata;
      if (width && height) {
        // Add validation logic for image dimensions
        if (width > 2000 || height > 2000) {
          return res.status(400).json({ 
            message: 'Image dimensions too large. Maximum 2000x2000 pixels.' 
          });
        }
      }
    }

    if (type === 'video') {
      // Validate video constraints
      const { duration, maxSize } = metadata;
      if (maxSize && maxSize > 50 * 1024 * 1024) { // 50MB limit
        return res.status(400).json({ 
          message: 'Video file too large. Maximum 50MB.' 
        });
      }
    }

    const content = await prisma.content.upsert({
      where: {
        section_key: {
          section: sectionKey,
          key: key
        }
      },
      update: {
        value,
        type,
        metadata,
        order,
        updatedAt: new Date()
      },
      create: {
        section: sectionKey,
        key,
        value,
        type,
        metadata,
        order
      }
    });

    res.json({ 
      message: 'Content updated successfully',
      content 
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete content
router.delete('/content/:page/:section/:key', authenticateToken, adminAuth, async (req, res) => {
  try {
    const { page, section, key } = req.params;
    const sectionKey = `${page}_${section}`;

    await prisma.content.delete({
      where: {
        section_key: {
          section: sectionKey,
          key: key
        }
      }
    });

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Expertise Management Routes
// Get all expertise items (public endpoint)
router.get('/expertise', async (req, res) => {
  try {
    const expertise = await prisma.expertise.findMany({
      orderBy: { order: 'asc' }
    });

    res.json({ items: expertise });
  } catch (error) {
    console.error('Get expertise error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk update expertise items
router.put('/expertise/bulk', [
  authenticateToken,
  adminAuth,
  body('items').isArray().withMessage('Items must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items } = req.body;

    // Check if prisma client is properly initialized
    if (!prisma || !prisma.expertise) {
      console.error('Prisma client not properly initialized');
      return res.status(500).json({ message: 'Database connection error' });
    }

    // Use transaction for atomic operation
    await prisma.$transaction(async (tx) => {
      // Delete all existing expertise items first
      await tx.expertise.deleteMany();

      // Create new items if any
      if (items && items.length > 0) {
        const validItems = items.filter(item => item.title && item.description);

        if (validItems.length > 0) {
          await tx.expertise.createMany({
            data: validItems.map((item, index) => ({
              title: item.title.trim(),
              description: item.description.trim(),
              icon: item.icon || '',
              order: item.order || index + 1
            }))
          });
        }
      }
    });

    res.json({
      message: 'Expertise items updated successfully',
      count: items ? items.length : 0
    });
  } catch (error) {
    console.error('Bulk update expertise error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      prismaAvailable: !!prisma,
      expertiseAvailable: !!(prisma && prisma.expertise)
    });
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Testimonials Management Routes
// Get all testimonials (public endpoint)
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: 'asc' }
    });

    res.json({ items: testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk update testimonials
router.put('/testimonials/bulk', [
  authenticateToken,
  adminAuth,
  body('items').isArray().withMessage('Items must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items } = req.body;

    // Delete all existing testimonials first
    await prisma.testimonial.deleteMany();

    // Create new items
    if (items.length > 0) {
      await prisma.testimonial.createMany({
        data: items.map((item, index) => ({
          text: item.text,
          author: item.author,
          company: item.company,
          avatar: item.avatar || null,
          order: item.order || index + 1
        }))
      });
    }

    res.json({ message: 'Testimonials updated successfully' });
  } catch (error) {
    console.error('Bulk update testimonials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Article Widgets Management Routes
// Get all article widgets
router.get('/article-widgets', async (req, res) => {
  try {
    const widgets = await prisma.articleWidget.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' }
    });

    res.json({ widgets });
  } catch (error) {
    console.error('Get article widgets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update article widgets (bulk)
router.put('/article-widgets/bulk', [
  authenticateToken,
  adminAuth,
  body('widgets').isArray().withMessage('Widgets must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { widgets } = req.body;

    // Use transaction for atomic operation
    await prisma.$transaction(async (tx) => {
      // Delete all existing widgets first
      await tx.articleWidget.deleteMany();

      // Create new widgets if any
      if (widgets && widgets.length > 0) {
        const validWidgets = widgets.filter(widget => widget.type && widget.title);

        if (validWidgets.length > 0) {
          await tx.articleWidget.createMany({
            data: validWidgets.map((widget, index) => ({
              type: widget.type,
              title: widget.title || '',
              content: widget.content || '',
              settings: widget.settings || {},
              position: widget.position || index + 1,
              isActive: widget.isActive !== false
            }))
          });
        }
      }
    });

    res.json({
      message: 'Article widgets updated successfully',
      count: widgets ? widgets.length : 0
    });
  } catch (error) {
    console.error('Bulk update article widgets error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
