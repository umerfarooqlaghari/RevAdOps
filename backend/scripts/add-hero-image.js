import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function addHeroImage() {
  try {
    console.log('Adding hero background image to database...');

    // High-quality tech/business background image from Unsplash
    // This is a professional image that works well for tech companies
    const heroImageUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80';

    // Add or update the hero background image
    const result = await prisma.content.upsert({
      where: {
        section_key: {
          section: 'hero',
          key: 'background_image'
        }
      },
      update: {
        value: heroImageUrl,
        type: 'image'
      },
      create: {
        section: 'hero',
        key: 'background_image',
        value: heroImageUrl,
        type: 'image'
      }
    });

    console.log('✅ Hero background image added successfully!');
    console.log('Image URL:', heroImageUrl);
    console.log('Database record:', result);

    // Also ensure we have good default hero content
    const heroContent = [
      {
        section: 'hero',
        key: 'title',
        value: 'Unlock Your Ad Revenue Potential with Intelligent Ad Operations',
        type: 'text'
      },
      {
        section: 'hero',
        key: 'subtitle',
        value: 'RevAdOps helps publishers and app developers maximize revenue, improve fill rates, and maintain quality traffic through advanced AdTech solutions and data-driven optimization.',
        type: 'text'
      },
      {
        section: 'hero',
        key: 'cta_primary_text',
        value: 'Get a Free Consultation',
        type: 'text'
      },
      {
        section: 'hero',
        key: 'cta_secondary_text',
        value: 'Learn More',
        type: 'text'
      }
    ];

    // Add hero content if it doesn't exist
    for (const content of heroContent) {
      await prisma.content.upsert({
        where: {
          section_key: {
            section: content.section,
            key: content.key
          }
        },
        update: {
          value: content.value,
          type: content.type
        },
        create: {
          section: content.section,
          key: content.key,
          value: content.value,
          type: content.type
        }
      });
    }

    console.log('✅ Hero content updated successfully!');

  } catch (error) {
    console.error('❌ Error adding hero image:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addHeroImage();
