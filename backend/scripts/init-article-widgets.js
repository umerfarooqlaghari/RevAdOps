import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initArticleWidgets() {
  try {
    console.log('Initializing article widgets...');

    // Check if widgets already exist
    const existingWidgets = await prisma.articleWidget.findMany();
    
    if (existingWidgets.length > 0) {
      console.log('✅ Article widgets already exist');
      return;
    }

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
        },
        isActive: true
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
        },
        isActive: true
      },
      {
        type: 'newsletter',
        title: 'Subscribe to Our Newsletter',
        content: 'Stay updated with the latest insights in ad operations and revenue optimization.',
        position: 3,
        settings: {
          buttonText: 'Subscribe Now',
          placeholder: 'Enter your email address'
        },
        isActive: true
      },
      {
        type: 'recent_articles',
        title: 'Article Archives',
        content: '',
        position: 4,
        settings: {
          limit: 5,
          showDate: true,
          showExcerpt: false
        },
        isActive: true
      }
    ];

    await prisma.articleWidget.createMany({
      data: defaultWidgets
    });

    console.log('✅ Article widgets initialized successfully!');
    console.log(`Added ${defaultWidgets.length} widgets`);

  } catch (error) {
    console.error('❌ Error initializing article widgets:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
initArticleWidgets();
