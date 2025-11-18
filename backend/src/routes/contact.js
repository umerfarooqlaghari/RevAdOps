import express from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database.js';

const router = express.Router();

// Submit contact form (public)
router.post('/submit', [
  body('firstName').notEmpty().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').notEmpty().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('website').notEmpty().isURL().withMessage('Valid website URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, website } = req.body;

    // Create lead with contact form data and store explicit fields
    const lead = await prisma.lead.create({
      data: {
        name: `${firstName} ${lastName}`,
        firstName: firstName || null,
        lastName: lastName || null,
        websiteUrl: website || null,
        email: email || null,
        phone: null,
        message: null,
        source: 'contact_form'
      }
    });

    res.status(201).json({
      message: 'Thank you for contacting us! We will get back to you soon.',
      leadId: lead.id
    });
  } catch (error) {
    console.error('Submit contact form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

