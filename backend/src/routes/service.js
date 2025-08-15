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
      where: { slug }
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
  body('icon').optional().isURL(),
  body('image').optional().isURL(),
  body('order').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, slug, shortDesc, icon, image, order, isActive } = req.body;

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
        isActive: isActive !== undefined ? isActive : true
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

export default router;
