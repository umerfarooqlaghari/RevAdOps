import express from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Submit lead (public)
router.post('/', [
  body('name').notEmpty().trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('message').optional().trim(),
  body('source').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, firstName, lastName, email, phone, websiteUrl, message, source } = req.body;

    // Keep backward-compatible `name` but prefer firstName+lastName when available
    const composedName = name || [firstName, lastName].filter(Boolean).join(' ').trim() || 'Anonymous';

    const lead = await prisma.lead.create({
      data: {
        name: composedName,
        firstName: firstName || null,
        lastName: lastName || null,
        websiteUrl: websiteUrl || null,
        email,
        phone,
        message,
        source: source || 'website'
      }
    });

    res.status(201).json({
      message: 'Thank you for your inquiry! We will get back to you soon.',
      leadId: lead.id
    });
  } catch (error) {
    console.error('Submit lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Newsletter signup (public)
router.post('/newsletter', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    await prisma.newsletter.upsert({
      where: { email },
      update: { isActive: true },
      create: { email }
    });

    res.json({
      message: 'Successfully subscribed to newsletter!'
    });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
// Get all leads (admin)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, source } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(source && { source })
    };

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.lead.count({ where })
    ]);

    res.json({
      leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get lead statistics (admin) - MOVED BEFORE parameterized routes
router.get('/admin/stats', authenticateToken, async (req, res) => {
  try {
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      closedLeads,
      newsletterSubscribers
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'new' } }),
      prisma.lead.count({ where: { status: 'contacted' } }),
      prisma.lead.count({ where: { status: 'converted' } }),
      prisma.lead.count({ where: { status: 'closed' } }),
      prisma.newsletter.count({ where: { isActive: true } })
    ]);

    // Get leads by source
    const leadsBySource = await prisma.lead.groupBy({
      by: ['source'],
      _count: {
        source: true
      }
    });

    // Get recent leads (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLeads = await prisma.lead.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    res.json({
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      closedLeads,
      newsletterSubscribers,
      recentLeads,
      leadsBySource
    });
  } catch (error) {
    console.error('Get lead stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export leads to CSV (admin) - MOVED BEFORE parameterized routes
router.get('/admin/export', authenticateToken, async (req, res) => {
  try {
    const { status, source, startDate, endDate } = req.query;

    const where = {
      ...(status && { status }),
      ...(source && { source }),
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Convert to CSV format (include firstName, lastName, websiteUrl)
    const csvHeader = 'First Name,Last Name,Name,Email,Website,Phone,Message,Source,Status,Created At\n';
    const csvData = leads.map(lead =>
      `"${lead.firstName || ''}","${lead.lastName || ''}","${lead.name || ''}","${lead.email}","${lead.websiteUrl || ''}","${lead.phone || ''}","${(lead.message || '').replace(/"/g, '""')}","${lead.source || ''}","${lead.status}","${lead.createdAt.toISOString()}"`
    ).join('\n');

    const csv = csvHeader + csvData;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get newsletter subscribers (admin) - MOVED BEFORE parameterized routes
router.get('/admin/newsletter', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      prisma.newsletter.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.newsletter.count({ where: { isActive: true } })
    ]);

    res.json({
      subscribers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get newsletter subscribers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get lead by ID (admin) - MOVED AFTER all specific routes
router.get('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id }
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update lead status (admin)
router.put('/admin/:id/status', authenticateToken, [
  body('status').isIn(['new', 'contacted', 'converted', 'closed'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const lead = await prisma.lead.findUnique({
      where: { id }
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status }
    });

    res.json({
      message: 'Lead status updated successfully',
      lead: updatedLead
    });
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete lead (admin)
router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id }
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await prisma.lead.delete({
      where: { id }
    });

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
