import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all HTML widgets (admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const widgets = await prisma.htmlWidget.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({ widgets });
  } catch (error) {
    console.error('Get HTML widgets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active HTML widgets (public - for frontend display)
router.get('/active', async (req, res) => {
  try {
    const widgets = await prisma.htmlWidget.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ widgets });
  } catch (error) {
    console.error('Get active HTML widgets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get HTML widget by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const widget = await prisma.htmlWidget.findUnique({
      where: { id }
    });

    if (!widget) {
      return res.status(404).json({ message: 'HTML widget not found' });
    }

    res.json({ widget });
  } catch (error) {
    console.error('Get HTML widget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create HTML widget (admin)
router.post('/', authenticateToken, [
  body('name').notEmpty().trim().withMessage('Widget name is required'),
  body('htmlContent').notEmpty().withMessage('HTML content is required'),
  body('title').optional().trim(),
  body('description').optional().trim(),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, title, htmlContent, description, isActive } = req.body;

    const widget = await prisma.htmlWidget.create({
      data: {
        name,
        title: title || null,
        htmlContent,
        description: description || null,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json({
      message: 'HTML widget created successfully',
      widget
    });
  } catch (error) {
    console.error('Create HTML widget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update HTML widget (admin)
router.put('/:id', authenticateToken, [
  body('name').optional().notEmpty().trim(),
  body('htmlContent').optional().notEmpty(),
  body('title').optional().trim(),
  body('description').optional().trim(),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if widget exists
    const existingWidget = await prisma.htmlWidget.findUnique({
      where: { id }
    });

    if (!existingWidget) {
      return res.status(404).json({ message: 'HTML widget not found' });
    }

    const widget = await prisma.htmlWidget.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'HTML widget updated successfully',
      widget
    });
  } catch (error) {
    console.error('Update HTML widget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete HTML widget (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if widget exists
    const existingWidget = await prisma.htmlWidget.findUnique({
      where: { id }
    });

    if (!existingWidget) {
      return res.status(404).json({ message: 'HTML widget not found' });
    }

    await prisma.htmlWidget.delete({
      where: { id }
    });

    res.json({ message: 'HTML widget deleted successfully' });
  } catch (error) {
    console.error('Delete HTML widget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get widgets by IDs (for blog display)
router.post('/by-ids', [
  body('widgetIds').isArray().withMessage('Widget IDs must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { widgetIds } = req.body;

    const widgets = await prisma.htmlWidget.findMany({
      where: {
        id: { in: widgetIds },
        isActive: true
      }
    });

    res.json({ widgets });
  } catch (error) {
    console.error('Get widgets by IDs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
