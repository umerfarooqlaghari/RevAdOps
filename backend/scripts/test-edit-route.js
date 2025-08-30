import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testEditRoute() {
  try {
    console.log('Testing edit route functionality...');

    // First, find an existing article
    const existingArticle = await prisma.blog.findFirst({
      where: {
        slug: 'productvsService'
      },
      include: {
        category: true
      }
    });

    if (!existingArticle) {
      console.log('❌ No test article found. Please create an article first.');
      return;
    }

    console.log('✅ Found test article:');
    console.log(`- ID: ${existingArticle.id}`);
    console.log(`- Title: ${existingArticle.title}`);
    console.log(`- Slug: ${existingArticle.slug}`);
    console.log(`- Author: ${existingArticle.author}`);
    console.log(`- Status: ${existingArticle.status}`);
    console.log(`- Meta Description: ${existingArticle.metaDescription}`);

    // Test fetching by ID (this is what the edit page does)
    const fetchedById = await prisma.blog.findUnique({
      where: { id: existingArticle.id },
      include: {
        category: true
      }
    });

    if (fetchedById) {
      console.log('✅ Successfully fetched article by ID');
      console.log('✅ Edit route should work now!');
      console.log(`✅ Edit URL: /admin/articles/${existingArticle.id}/edit`);
    } else {
      console.log('❌ Failed to fetch article by ID');
    }

  } catch (error) {
    console.error('❌ Error testing edit route:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
testEditRoute();
