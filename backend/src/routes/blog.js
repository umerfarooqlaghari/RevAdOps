import express from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all published blogs (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      isPublished: true,
      ...(category && { category: { slug: category } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } }
        ]
      })
    };

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          category: true
        },
        orderBy: { publishedAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.blog.count({ where })
    ]);

    res.json({
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog by slug (public)
router.get('/post/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        category: true
      }
    });

    if (!blog || !blog.isPublished) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
// Get all blogs (admin)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.blog.count()
    ]);

    res.json({
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create blog (admin)
router.post('/', authenticateToken, [
  body('title').notEmpty().trim(),
  body('content').notEmpty(),
  body('slug').notEmpty().trim(),
  body('excerpt').optional().trim(),
  body('categoryId').optional().isString(),
  body('tags').optional().isArray(),
  body('featuredImage').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, slug, excerpt, categoryId, tags, featuredImage, isPublished } = req.body;

    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug }
    });

    if (existingBlog) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        slug,
        excerpt,
        categoryId,
        tags: tags || [],
        featuredImage,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null
      },
      include: {
        category: true
      }
    });

    res.status(201).json({
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog (admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, slug, excerpt, categoryId, tags, featuredImage, isPublished } = req.body;

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id }
    });

    if (!existingBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== existingBlog.slug) {
      const slugExists = await prisma.blog.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
    }

    const updateData = {
      ...(title && { title }),
      ...(content && { content }),
      ...(slug && { slug }),
      ...(excerpt !== undefined && { excerpt }),
      ...(categoryId !== undefined && { categoryId }),
      ...(tags && { tags }),
      ...(featuredImage !== undefined && { featuredImage }),
      ...(isPublished !== undefined && { 
        isPublished,
        publishedAt: isPublished && !existingBlog.publishedAt ? new Date() : existingBlog.publishedAt
      })
    };

    const blog = await prisma.blog.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    });

    res.json({
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { id }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await prisma.blog.delete({
      where: { id }
    });

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Blog categories routes
// Get all categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: { blogs: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create category (admin)
router.post('/categories', authenticateToken, [
  body('name').notEmpty().trim(),
  body('slug').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, slug } = req.body;

    const category = await prisma.blogCategory.create({
      data: { name, slug }
    });

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Category name or slug already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
