import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check admin role
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Get enabled scripts for public use (layout injection)
router.get('/enabled', async (req, res) => {
  try {
    const scripts = await prisma.script.findMany({
      where: {
        enabled: true
      },
      select: {
        id: true,
        code: true,
        locations: true,
        title: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json(scripts);
  } catch (error) {
    console.error('Get enabled scripts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all scripts (admin)
router.get('/admin/all', authenticateToken, adminAuth, async (req, res) => {
  try {
    const pageParam = parseInt(req.query.page);
    const limitParam = parseInt(req.query.limit);
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 10;
    const offset = (page - 1) * limit;

    const [scripts, totalResult] = await Promise.all([
      prisma.script.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.script.count()
    ]);

    res.json({
      items: scripts,
      pagination: {
        page,
        limit,
        total: totalResult,
        pages: Math.ceil(totalResult / limit)
      }
    });
  } catch (error) {
    console.error('Get admin scripts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create script (admin)
router.post('/', [
  authenticateToken,
  body('code').notEmpty().withMessage('Script code is required'),
  body('locations').isArray().withMessage('Locations must be an array'),
  body('locations.*').isIn(['head', 'footer']).withMessage('Each location must be either "head" or "footer"'),
  body('title').optional().isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
  body('enabled').optional().isBoolean().withMessage('Enabled must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, locations, title, enabled = true } = req.body;

    const script = await prisma.script.create({
      data: {
        code,
        locations,
        title,
        enabled
      }
    });

    res.status(201).json({
      message: 'Script created successfully',
      script
    });
  } catch (error) {
    console.error('Create script error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update script (admin)
router.put('/:id', [
  authenticateToken,
  body('code').optional().notEmpty().withMessage('Script code cannot be empty'),
  body('locations').optional().isArray().withMessage('Locations must be an array'),
  body('locations.*').optional().isIn(['head', 'footer']).withMessage('Each location must be either "head" or "footer"'),
  body('title').optional().isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
  body('enabled').optional().isBoolean().withMessage('Enabled must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = {};

    // Only include fields that are provided
    if (req.body.code !== undefined) updateData.code = req.body.code;
    if (req.body.locations !== undefined) updateData.locations = req.body.locations;
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.enabled !== undefined) updateData.enabled = req.body.enabled;

    const script = await prisma.script.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Script updated successfully',
      script
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Script not found' });
    }
    console.error('Update script error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete script (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.script.delete({
      where: { id }
    });

    res.json({
      message: 'Script deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Script not found' });
    }
    console.error('Delete script error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single script (admin)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const script = await prisma.script.findUnique({
      where: { id }
    });

    if (!script) {
      return res.status(404).json({ message: 'Script not found' });
    }

    res.json(script);
  } catch (error) {
    console.error('Get script error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
