import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addCustomUrlField() {
  try {
    console.log('Adding customUrl field to blogs table...');

    // Note: In production, you should use proper Prisma migrations
    // This script is for development purposes
    
    // The field will be added automatically when you run: npx prisma db push
    // or create a proper migration with: npx prisma migrate dev --name add-custom-url
    
    console.log('✅ CustomUrl field will be added when you run: npx prisma db push');
    console.log('📝 Or create a migration with: npx prisma migrate dev --name add-custom-url');
    
    // Verify the schema is ready
    const sampleBlog = await prisma.blog.findFirst();
    if (sampleBlog) {
      console.log('✅ Blog table exists and is ready for the new field');
    }

  } catch (error) {
    console.error('❌ Error preparing customUrl field:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addCustomUrlField();
