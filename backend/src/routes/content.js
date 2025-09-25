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

// Simple rate limiting for content updates
const updateLimiter = new Map();
const RATE_LIMIT_WINDOW = 3000; // 3 seconds
const MAX_UPDATES_PER_WINDOW = 2;

const checkRateLimit = (req, res, next) => {
  const clientId = req.ip + (req.user?.id || 'anonymous');
  const now = Date.now();

  if (!updateLimiter.has(clientId)) {
    updateLimiter.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }

  const limit = updateLimiter.get(clientId);

  if (now > limit.resetTime) {
    updateLimiter.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }

  if (limit.count >= MAX_UPDATES_PER_WINDOW) {
    return res.status(429).json({
      message: 'Too many update requests. Please wait a moment before trying again.'
    });
  }

  limit.count++;
  next();
};

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
router.put('/:section/:key', authenticateToken, adminAuth, checkRateLimit, [
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

// Optimized bulk update content for a section
router.put('/:section', authenticateToken, adminAuth, checkRateLimit, async (req, res) => {
  try {
    const { section } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== 'object') {
      return res.status(400).json({ message: 'Invalid content data' });
    }

    console.log(`Updating section: ${section} with ${Object.keys(content).length} items`);
    const startTime = Date.now();

    // Use a single transaction for all operations
    await prisma.$transaction(async (tx) => {
      // Process in smaller batches to avoid overwhelming the database
      const entries = Object.entries(content);
      const batchSize = 5; // Smaller batches for better performance

      for (let i = 0; i < entries.length; i += batchSize) {
        const batch = entries.slice(i, i + batchSize);

        await Promise.all(
          batch.map(([key, data]) =>
            tx.content.upsert({
              where: {
                section_key: { section, key }
              },
              update: {
                value: data.value || '',
                type: data.type || 'text'
              },
              create: {
                section,
                key,
                value: data.value || '',
                type: data.type || 'text'
              }
            })
          )
        );

        // Small delay between batches to prevent overwhelming the connection
        if (i + batchSize < entries.length) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
    });

    const endTime = Date.now();
    console.log(`Section ${section} updated in ${endTime - startTime}ms`);

    res.json({
      message: 'Content updated successfully',
      section,
      itemsUpdated: Object.keys(content).length,
      duration: endTime - startTime
    });
  } catch (error) {
    console.error('Bulk update content error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// Get all content organized by sections
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all content...');
    const startTime = Date.now();

    const allContent = await prisma.content.findMany({
      orderBy: [
        { section: 'asc' },
        { key: 'asc' }
      ]
    });

    const endTime = Date.now();
    console.log(`Content fetched in ${endTime - startTime}ms (${allContent.length} items)`);

    // Organize content by sections, removing homepage_ prefix for homepage sections
    const contentBySections = allContent.reduce((acc, item) => {
      let sectionName = item.section;

      // Remove homepage_ prefix for homepage sections to match frontend expectations
      if (sectionName.startsWith('homepage_')) {
        sectionName = sectionName.replace('homepage_', '');
      }

      if (!acc[sectionName]) {
        acc[sectionName] = {};
      }
      acc[sectionName][item.key] = item.value;
      return acc;
    }, {});



    res.json(contentBySections);
  } catch (error) {
    console.error('Get all content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
