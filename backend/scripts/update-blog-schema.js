import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateBlogSchema() {
  try {
    console.log('Updating blog schema for detailed articles...');

    // First, let's add the new columns to existing blogs if they don't exist
    // Note: In production, you should use proper Prisma migrations
    
    // Update existing blogs to have default values for new fields
    const existingBlogs = await prisma.blog.findMany();
    
    for (const blog of existingBlogs) {
      await prisma.blog.update({
        where: { id: blog.id },
        data: {
          author: blog.author || 'RevAdOps Team',
          metaDescription: blog.metaDescription || blog.excerpt || blog.title,
          status: blog.isPublished ? 'published' : 'draft',
          viewCount: 0
        }
      });
    }

    console.log(`✅ Updated ${existingBlogs.length} existing blog posts`);

    // Create default article widgets
    const defaultWidgets = [
      {
        type: 'ad_slot',
        title: 'Advertisement',
        content: '<div class="ad-placeholder">Ad Space 300x250</div>',
        position: 1,
        settings: {
          width: 300,
          height: 250,
          adType: 'banner'
        }
      },
      {
        type: 'ad_slot',
        title: 'Advertisement',
        content: '<div class="ad-placeholder">Ad Space 300x250</div>',
        position: 2,
        settings: {
          width: 300,
          height: 250,
          adType: 'banner'
        }
      },
      {
        type: 'newsletter',
        title: 'Subscribe to Our Newsletter',
        content: 'Stay updated with the latest insights in ad operations and revenue optimization.',
        position: 3,
        settings: {
          buttonText: 'Subscribe Now',
          placeholder: 'Enter your email address'
        }
      },
      {
        type: 'recent_articles',
        title: 'Recent Articles',
        content: '',
        position: 4,
        settings: {
          limit: 5,
          showDate: true,
          showExcerpt: false
        }
      }
    ];

    // Check if widgets already exist
    const existingWidgets = await prisma.articleWidget.findMany();
    
    if (existingWidgets.length === 0) {
      await prisma.articleWidget.createMany({
        data: defaultWidgets
      });
      console.log('✅ Created default article widgets');
    } else {
      console.log('✅ Article widgets already exist');
    }

    console.log('✅ Blog schema update completed successfully!');

  } catch (error) {
    console.error('❌ Error updating blog schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateBlogSchema();
