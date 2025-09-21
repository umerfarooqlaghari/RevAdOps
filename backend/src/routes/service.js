import express from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all active services (public)
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single service by slug (public)
router.get('/detail/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        packages: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
// Get all services (admin)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        packages: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    res.json(services);
  } catch (error) {
    console.error('Get admin services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create service (admin)
router.post('/', authenticateToken, [
  body('title').notEmpty().trim(),
  body('description').notEmpty(),
  body('slug').notEmpty().trim(),
  body('shortDesc').optional().trim(),
  body('icon').optional().trim(),
  body('image').optional().custom((value) => {
    if (!value || value === '') return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }),
  body('order').optional().isInt({ min: 0 }),
  body('metaTitle').optional().trim(),
  body('metaDescription').optional().trim(),
  body('metaKeywords').optional().trim(),
  body('ctaText').optional().trim(),
  body('ctaLink').optional().trim(),
  body('images').optional().isArray(),
  body('packages').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title, description, slug, shortDesc, icon, image, order, isActive,
      metaTitle, metaDescription, metaKeywords, ctaText, ctaLink,
      images, packages
    } = req.body;

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug }
    });

    if (existingService) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        slug,
        shortDesc,
        icon,
        image,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        metaTitle,
        metaDescription,
        metaKeywords,
        ctaText,
        ctaLink,
        images: images ? {
          create: images.map((img, index) => ({
            url: img.url,
            alt: img.alt || '',
            order: img.order || index
          }))
        } : undefined,
        packages: packages ? {
          create: packages.map((pkg, index) => ({
            title: pkg.title,
            description: pkg.description,
            price: pkg.price,
            features: pkg.features || [],
            isPopular: pkg.isPopular || false,
            order: pkg.order || index,
            ctaText: pkg.ctaText || 'Select plan',
            ctaLink: pkg.ctaLink,
            isActive: pkg.isActive !== undefined ? pkg.isActive : true
          }))
        } : undefined
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        packages: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service (admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, slug, shortDesc, icon, image, order, isActive } = req.body;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== existingService.slug) {
      const slugExists = await prisma.service.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
    }

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(slug && { slug }),
      ...(shortDesc !== undefined && { shortDesc }),
      ...(icon !== undefined && { icon }),
      ...(image !== undefined && { image }),
      ...(order !== undefined && { order }),
      ...(isActive !== undefined && { isActive })
    };

    const service = await prisma.service.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete service (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await prisma.service.delete({
      where: { id }
    });

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service order (admin)
router.put('/admin/reorder', authenticateToken, [
  body('services').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { services } = req.body;

    const updates = services.map((service, index) =>
      prisma.service.update({
        where: { id: service.id },
        data: { order: index }
      })
    );

    await Promise.all(updates);

    res.json({ message: 'Service order updated successfully' });
  } catch (error) {
    console.error('Reorder services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Service Package Routes

// Get all service packages (public)
router.get('/packages', async (req, res) => {
  try {
    const servicePackages = await prisma.servicePackage.findMany({
      where: { isActive: true },
      include: {
        service: {
          select: { id: true, title: true, slug: true }
        }
      },
      orderBy: { order: 'asc' }
    });

    res.json(servicePackages);
  } catch (error) {
    console.error('Get service packages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all service packages (admin)
router.get('/admin/packages', authenticateToken, async (req, res) => {
  try {
    const servicePackages = await prisma.servicePackage.findMany({
      include: {
        service: {
          select: { id: true, title: true, slug: true }
        }
      },
      orderBy: { order: 'asc' }
    });

    res.json(servicePackages);
  } catch (error) {
    console.error('Get admin service packages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create service package (admin)
router.post('/packages', authenticateToken, [
  body('title').notEmpty().trim(),
  body('description').notEmpty(),
  body('price').notEmpty().trim(),
  body('features').isArray(),
  body('serviceId').optional().custom((value) => {
    return value === null || value === '' || typeof value === 'string';
  }),
  body('order').optional().isInt({ min: 0 }),
  body('ctaText').optional().trim(),
  body('ctaLink').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title, description, price, features, serviceId, order,
      isPopular, ctaText, ctaLink, isActive
    } = req.body;

    const newServicePackage = await prisma.servicePackage.create({
      data: {
        title,
        description,
        price,
        features,
        serviceId: serviceId || null,
        order: order || 0,
        isPopular: isPopular || false,
        ctaText: ctaText || 'Select plan',
        ctaLink,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        service: {
          select: { id: true, title: true, slug: true }
        }
      }
    });

    res.status(201).json({
      message: 'Service package created successfully',
      package: newServicePackage
    });
  } catch (error) {
    console.error('Create service package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service package (admin)
router.put('/packages/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, price, features, serviceId, order,
      isPopular, ctaText, ctaLink, isActive
    } = req.body;

    const existingPackage = await prisma.servicePackage.findUnique({
      where: { id }
    });

    if (!existingPackage) {
      return res.status(404).json({ message: 'Service package not found' });
    }

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(price && { price }),
      ...(features && { features }),
      ...(serviceId !== undefined && { serviceId: serviceId || null }),
      ...(order !== undefined && { order }),
      ...(isPopular !== undefined && { isPopular }),
      ...(ctaText && { ctaText }),
      ...(ctaLink !== undefined && { ctaLink }),
      ...(isActive !== undefined && { isActive })
    };

    const updatedServicePackage = await prisma.servicePackage.update({
      where: { id },
      data: updateData,
      include: {
        service: {
          select: { id: true, title: true, slug: true }
        }
      }
    });

    res.json({
      message: 'Service package updated successfully',
      package: updatedServicePackage
    });
  } catch (error) {
    console.error('Update service package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete service package (admin)
router.delete('/packages/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const servicePackageToDelete = await prisma.servicePackage.findUnique({
      where: { id }
    });

    if (!servicePackageToDelete) {
      return res.status(404).json({ message: 'Service package not found' });
    }

    await prisma.servicePackage.delete({
      where: { id }
    });

    res.json({ message: 'Service package deleted successfully' });
  } catch (error) {
    console.error('Delete service package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
