import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initBlogCategories() {
  try {
    console.log('Initializing blog categories...');

    const defaultCategories = [
      {
        name: 'Ad Operations',
        slug: 'ad-operations'
      },
      {
        name: 'Revenue Optimization',
        slug: 'revenue-optimization'
      },
      {
        name: 'Industry News',
        slug: 'industry-news'
      },
      {
        name: 'Case Studies',
        slug: 'case-studies'
      },
      {
        name: 'Best Practices',
        slug: 'best-practices'
      },
      {
        name: 'Technology',
        slug: 'technology'
      },
      {
        name: 'Business Strategy',
        slug: 'business-strategy'
      }
    ];

    // Check existing categories
    const existingCategories = await prisma.blogCategory.findMany();
    const existingSlugs = existingCategories.map(cat => cat.slug);

    console.log(`Found ${existingCategories.length} existing categories:`);
    existingCategories.forEach(cat => console.log(`- ${cat.name} (${cat.slug})`));

    // Create only new categories
    let createdCount = 0;
    for (const category of defaultCategories) {
      if (!existingSlugs.includes(category.slug)) {
        await prisma.blogCategory.create({
          data: category
        });
        console.log(`✅ Created category: ${category.name}`);
        createdCount++;
      } else {
        console.log(`⏭️  Skipped existing category: ${category.name}`);
      }
    }

    console.log('✅ Blog categories initialized successfully!');
    console.log(`Added ${createdCount} new categories`);

  } catch (error) {
    console.error('❌ Error initializing blog categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
initBlogCategories();
