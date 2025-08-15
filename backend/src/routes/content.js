import express from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get content by section
router.get('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    
    const content = await prisma.content.findMany({
      where: { section },
      orderBy: { key: 'asc' }
    });

    // Convert to key-value object
    const contentObj = content.reduce((acc, item) => {
      acc[item.key] = {
        value: item.value,
        type: item.type,
        updatedAt: item.updatedAt
      };
      return acc;
    }, {});

    res.json(contentObj);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update content
router.put('/:section/:key', authenticateToken, [
  body('value').notEmpty(),
  body('type').optional().isIn(['text', 'image', 'html'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { section, key } = req.params;
    const { value, type = 'text' } = req.body;

    const content = await prisma.content.upsert({
      where: {
        section_key: {
          section,
          key
        }
      },
      update: {
        value,
        type
      },
      create: {
        section,
        key,
        value,
        type
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

// Bulk update content for a section
router.put('/:section', authenticateToken, async (req, res) => {
  try {
    const { section } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== 'object') {
      return res.status(400).json({ message: 'Invalid content data' });
    }

    const updates = [];
    
    for (const [key, data] of Object.entries(content)) {
      updates.push(
        prisma.content.upsert({
          where: {
            section_key: {
              section,
              key
            }
          },
          update: {
            value: data.value,
            type: data.type || 'text'
          },
          create: {
            section,
            key,
            value: data.value,
            type: data.type || 'text'
          }
        })
      );
    }

    await Promise.all(updates);

    res.json({ message: 'Content updated successfully' });
  } catch (error) {
    console.error('Bulk update content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all sections
router.get('/', async (req, res) => {
  try {
    const sections = await prisma.content.groupBy({
      by: ['section'],
      _count: {
        section: true
      }
    });

    res.json(sections);
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
