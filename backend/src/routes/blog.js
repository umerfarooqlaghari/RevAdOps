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

// SPECIFIC ROUTES FIRST
// Admin routes - Get all blogs (admin)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, category } = req.query;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (category) {
      where.categoryId = category;
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' },
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
    console.error('Get admin blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Blog categories routes - SPECIFIC ROUTES BEFORE PARAMETERIZED
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

    // Check if slug already exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category slug already exists' });
    }

    const category = await prisma.blogCategory.create({
      data: { name, slug }
    });

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category (admin)
router.put('/categories/:id', authenticateToken, [
  body('name').notEmpty().trim(),
  body('slug').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, slug } = req.body;

    // Check if category exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if slug is being changed and if it already exists
    if (slug !== existingCategory.slug) {
      const slugExists = await prisma.blogCategory.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return res.status(400).json({ message: 'Category slug already exists' });
      }
    }

    const category = await prisma.blogCategory.update({
      where: { id },
      data: { name, slug },
      include: {
        _count: {
          select: { blogs: true }
        }
      }
    });

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category (admin)
router.delete('/categories/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.blogCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { blogs: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has blogs
    if (category._count.blogs > 0) {
      return res.status(400).json({
        message: 'Cannot delete category with existing blogs. Please reassign or delete the blogs first.'
      });
    }

    await prisma.blogCategory.delete({
      where: { id }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PARAMETERIZED ROUTES AFTER SPECIFIC ROUTES
// Get single blog by ID (admin)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        category: true
      }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Get blog by ID error:', error);
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

// Increment view count for a blog post
router.post('/post/:slug/view', async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { slug }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment view count
    await prisma.blog.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });

    res.json({ message: 'View count updated' });
  } catch (error) {
    console.error('Update view count error:', error);
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
  body('author').optional().trim(),
  body('metaDescription').optional().trim(),
  body('metaTitle').optional().trim(),
  body('metaKeywords').optional().trim(),
  body('metaCategory').optional().trim(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('featuredImage').optional().custom((value) => {
    if (!value || value === '' || value === null) return true; // Allow empty strings and null
    return /^https?:\/\/.+/.test(value); // Validate URL format if not empty
  }),
  body('customUrl').optional().custom((value) => {
    if (!value || value === '' || value === null) return true; // Allow empty strings and null
    return /^https?:\/\/.+/.test(value); // Validate URL format if not empty
  }),
  body('advertisement1').optional().custom((value) => {
    if (!value || value === '' || value === null) return true; // Allow empty strings and null
    return /^https?:\/\/.+/.test(value); // Validate URL format if not empty
  }),
  body('advertisement2').optional().custom((value) => {
    if (!value || value === '' || value === null) return true; // Allow empty strings and null
    return /^https?:\/\/.+/.test(value); // Validate URL format if not empty
  }),
  body('htmlWidgetIds').optional().isArray().withMessage('HTML widget IDs must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      content,
      slug,
      excerpt,
      categoryId,
      tags,
      featuredImage,
      author,
      metaDescription,
      metaTitle,
      metaKeywords,
      metaCategory,
      status,
      isPublished,
      publishedAt,
      customUrl,
      advertisement1,
      advertisement2,
      htmlWidgetIds
    } = req.body;

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
        categoryId: categoryId || null,
        tags: tags || [],
        featuredImage,
        author: author || 'RevAdOps Team',
        metaDescription: metaDescription || excerpt || title,
        metaTitle: metaTitle || title,
        metaKeywords: metaKeywords || null,
        metaCategory: metaCategory || null,
        status: status || 'draft',
        isPublished: isPublished || false,
        publishedAt: (isPublished && publishedAt) ? new Date(publishedAt) : (isPublished ? new Date() : null),
        viewCount: 0,
        customUrl: customUrl || null,
        advertisement1: advertisement1 || null,
        advertisement2: advertisement2 || null,
        htmlWidgetIds: htmlWidgetIds || []
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
    const {
      title,
      content,
      slug,
      excerpt,
      categoryId,
      tags,
      featuredImage,
      author,
      metaDescription,
      metaTitle,
      metaKeywords,
      metaCategory,
      status,
      isPublished,
      publishedAt,
      customUrl,
      advertisement1,
      advertisement2,
      htmlWidgetIds
    } = req.body;

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
      ...(categoryId !== undefined && { categoryId: categoryId || null }),
      ...(tags && { tags }),
      ...(featuredImage !== undefined && { featuredImage }),
      ...(author !== undefined && { author }),
      ...(metaDescription !== undefined && { metaDescription }),
      ...(metaTitle !== undefined && { metaTitle }),
      ...(metaKeywords !== undefined && { metaKeywords }),
      ...(metaCategory !== undefined && { metaCategory }),
      ...(status !== undefined && { status }),
      ...(customUrl !== undefined && { customUrl: customUrl || null }),
      ...(advertisement1 !== undefined && { advertisement1: advertisement1 || null }),
      ...(advertisement2 !== undefined && { advertisement2: advertisement2 || null }),
      ...(htmlWidgetIds !== undefined && { htmlWidgetIds: htmlWidgetIds || [] }),
      ...(isPublished !== undefined && {
        isPublished,
        publishedAt: isPublished && !existingBlog.publishedAt ? new Date() : existingBlog.publishedAt
      }),
      ...(publishedAt && { publishedAt: new Date(publishedAt) })
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

export default router;
