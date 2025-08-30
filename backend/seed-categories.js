import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  try {
    // Check if categories already exist
    const existingCategories = await prisma.blogCategory.findMany();
    
    if (existingCategories.length > 0) {
      console.log('Categories already exist:', existingCategories);
      return;
    }

    // Create default categories
    const categories = [
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Technology related articles'
      },
      {
        name: 'Business',
        slug: 'business', 
        description: 'Business and marketing articles'
      },
      {
        name: 'SEO',
        slug: 'seo',
        description: 'Search Engine Optimization articles'
      },
      {
        name: 'Digital Marketing',
        slug: 'digital-marketing',
        description: 'Digital marketing strategies and tips'
      },
      {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Web development tutorials and guides'
      }
    ];

    for (const category of categories) {
      await prisma.blogCategory.create({
        data: category
      });
      console.log(`Created category: ${category.name}`);
    }

    console.log('✅ Categories seeded successfully!');
    
    // Display all categories with their IDs
    const allCategories = await prisma.blogCategory.findMany();
    console.log('\nAvailable categories:');
    allCategories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat.id})`);
    });

  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();
