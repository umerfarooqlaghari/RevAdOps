import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all advertisements (admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const advertisements = await prisma.advertisement.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(advertisements);
  } catch (error) {
    console.error('Get advertisements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active advertisements (public)
router.get('/active', async (req, res) => {
  try {
    const { position } = req.query;
    
    const where = { isActive: true };
    if (position) {
      where.position = position;
    }

    const advertisements = await prisma.advertisement.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(advertisements);
  } catch (error) {
    console.error('Get active advertisements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create advertisement (admin)
router.post('/', authenticateToken, [
  body('title').notEmpty().trim(),
  body('image').notEmpty().isURL(),
  body('link').notEmpty().isURL(),
  body('position').isIn(['sidebar', 'header', 'footer', 'content']),
  body('size').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, image, link, position, size, isActive } = req.body;

    const advertisement = await prisma.advertisement.create({
      data: {
        title,
        description,
        image,
        link,
        position,
        size,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json({
      message: 'Advertisement created successfully',
      advertisement
    });
  } catch (error) {
    console.error('Create advertisement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update advertisement (admin)
router.put('/:id', authenticateToken, [
  body('title').optional().notEmpty().trim(),
  body('image').optional().isURL(),
  body('link').optional().isURL(),
  body('position').optional().isIn(['sidebar', 'header', 'footer', 'content']),
  body('size').optional().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if advertisement exists
    const existingAd = await prisma.advertisement.findUnique({
      where: { id }
    });

    if (!existingAd) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    const advertisement = await prisma.advertisement.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Advertisement updated successfully',
      advertisement
    });
  } catch (error) {
    console.error('Update advertisement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete advertisement (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const advertisement = await prisma.advertisement.findUnique({
      where: { id }
    });

    if (!advertisement) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    await prisma.advertisement.delete({
      where: { id }
    });

    res.json({ message: 'Advertisement deleted successfully' });
  } catch (error) {
    console.error('Delete advertisement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
