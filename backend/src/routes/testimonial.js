import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get testimonials for homepage (public)
router.get('/homepage', async (req, res) => {
  try {
    const limitParam = parseInt(req.query.limit);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 20) : 10;

    const rows = await prisma.$queryRaw`SELECT id, LEFT(text, 400) AS text, author AS "clientName", company AS "companyName", CASE WHEN avatar LIKE 'data:%' THEN NULL ELSE LEFT(avatar, 2048) END AS "clientImage", "order"
      FROM "testimonials"
      ORDER BY "order" ASC
      LIMIT ${limit}`;

    const testimonials = rows.map(t => ({
      ...t,
      showOnHomepage: true,
      showOnServices: true,
      isActive: true,
    }));

    res.json(testimonials);
  } catch (error) {
    console.error('Get homepage testimonials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get testimonials for services page (public)
router.get('/services', async (req, res) => {
  try {
    const limitParam = parseInt(req.query.limit);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 20) : 10;

    const rows = await prisma.$queryRaw`SELECT id, LEFT(text, 400) AS text, author AS "clientName", company AS "companyName", CASE WHEN avatar LIKE 'data:%' THEN NULL ELSE LEFT(avatar, 2048) END AS "clientImage", "order"
      FROM "testimonials"
      ORDER BY "order" ASC
      LIMIT ${limit}`;

    const testimonials = rows.map(t => ({
      ...t,
      showOnHomepage: true,
      showOnServices: true,
      isActive: true,
    }));

    res.json(testimonials);
  } catch (error) {
    console.error('Get services testimonials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all testimonials (admin)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const pageParam = parseInt(req.query.page);
    const limitParam = parseInt(req.query.limit);
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 10;
    const offset = (page - 1) * limit;

    const [rows, totalResult] = await Promise.all([
      prisma.$queryRaw`SELECT id, LEFT(text, 600) AS text, author AS "clientName", company AS "companyName", CASE WHEN avatar LIKE 'data:%' THEN NULL ELSE LEFT(avatar, 2048) END AS "clientImage", "order", "createdAt", "updatedAt"
        FROM "testimonials"
        ORDER BY "order" ASC
        LIMIT ${limit} OFFSET ${offset}`,
      prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "testimonials"`,
    ]);

    const total = Number(totalResult?.[0]?.count || 0);

    const items = rows.map(t => ({
      ...t,
      showOnHomepage: t.showOnHomepage ?? true,
      showOnServices: t.showOnServices ?? true,
      isActive: t.isActive ?? true,
    }));

    res.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get admin testimonials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create testimonial (admin)
router.post('/admin', authenticateToken, [
  body('text').notEmpty().trim(),
  body('clientName').notEmpty().trim(),
  body('companyName').optional().trim(),
  body('clientImage').optional().custom((value) => {
    if (!value || value === '') return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }),
  body('showOnServices').optional().isBoolean(),
  body('showOnHomepage').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      text, clientName, companyName, clientImage,
      showOnServices, showOnHomepage, isActive, order
    } = req.body;

    const testimonial = await prisma.testimonial.create({
      data: {
        text,
        clientName,
        companyName: companyName || null,
        clientImage: clientImage || null,
        showOnServices: showOnServices !== undefined ? showOnServices : true,
        showOnHomepage: showOnHomepage !== undefined ? showOnHomepage : true,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0
      }
    });

    res.status(201).json({
      message: 'Testimonial created successfully',
      testimonial
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update testimonial (admin)
router.put('/admin/:id', authenticateToken, [
  body('text').optional().trim(),
  body('clientName').optional().trim(),
  body('companyName').optional().trim(),
  body('clientImage').optional().custom((value) => {
    if (!value || value === '') return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }),
  body('showOnServices').optional().isBoolean(),
  body('showOnHomepage').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      text, clientName, companyName, clientImage,
      showOnServices, showOnHomepage, isActive, order
    } = req.body;

    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!existingTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const updateData = {
      ...(text && { text }),
      ...(clientName && { clientName }),
      ...(companyName !== undefined && { companyName: companyName || null }),
      ...(clientImage !== undefined && { clientImage: clientImage || null }),
      ...(showOnServices !== undefined && { showOnServices }),
      ...(showOnHomepage !== undefined && { showOnHomepage }),
      ...(isActive !== undefined && { isActive }),
      ...(order !== undefined && { order })
    };

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Testimonial updated successfully',
      testimonial
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete testimonial (admin)
router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await prisma.testimonial.delete({
      where: { id }
    });

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
