import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initAboutContent() {
  try {
    console.log('Initializing About Us page content...');

    const aboutContent = [
      // About Hero Section
      {
        section: 'about_hero',
        key: 'title',
        value: 'About RevAdOps',
        type: 'text'
      },
      {
        section: 'about_hero',
        key: 'subtitle',
        value: 'Your trusted partner in ad revenue optimization and traffic quality management',
        type: 'text'
      },

      // Director Section
      {
        section: 'about_director',
        key: 'name',
        value: 'Silvia',
        type: 'text'
      },
      {
        section: 'about_director',
        key: 'title',
        value: 'Director of RevAdOps',
        type: 'text'
      },
      {
        section: 'about_director',
        key: 'brief',
        value: 'Dedicated to Ad Operations for Publishers in Digital Media since 2013',
        type: 'text'
      },
      {
        section: 'about_director',
        key: 'photo',
        value: '/placeholder-director.jpg',
        type: 'image'
      },
      {
        section: 'about_director',
        key: 'experience',
        value: '9000+ hours',
        type: 'text'
      },
      {
        section: 'about_director',
        key: 'clients',
        value: '130+ global clients',
        type: 'text'
      },
      {
        section: 'about_director',
        key: 'specialization',
        value: 'GAM & Programmatic',
        type: 'text'
      },

      // About Content Section
      {
        section: 'about_content',
        key: 'about_title',
        value: 'About RevAdOps',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'about_description',
        value: 'At RevAdOps, we specialize in providing end-to-end Ad Operations solutions tailored for publishers in the digital media space. Our mission is to empower publishers with seamless ad management, revenue optimization, and transparent reporting to maximize yield from their digital inventory.',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'about_expertise',
        value: 'We understand the complexities of today\'s programmatic ecosystem—whether it\'s display, video, mobile, or header bidding—and we bring the expertise to simplify operations, safeguard compliance, and ensure sustainable revenue growth. With a focus on quality, performance, and strategic execution, RevAdOps serves as a trusted partner for publishers across the globe.',
        type: 'text'
      },

      // Services Section
      {
        section: 'about_content',
        key: 'services_title',
        value: 'Our Services Include:',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'service_1_title',
        value: 'AdOps for Publishers',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'service_1_desc',
        value: 'Streamlining ad trafficking, campaign management, and reporting.',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'service_2_title',
        value: 'Revenue Optimization',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'service_2_desc',
        value: 'Maximizing yield with data-driven strategies.',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'service_3_title',
        value: 'Programmatic Solutions',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'service_3_desc',
        value: 'Expertise in MCM, GAM, SSPs, and header bidding.',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'service_4_title',
        value: 'Publisher Relations',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'service_4_desc',
        value: 'Supporting sustainable, policy-compliant inventory growth.',
        type: 'text'
      },

      // Director Section in Content
      {
        section: 'about_content',
        key: 'director_section_title',
        value: 'Meet Silvia – Director of RevAdOps',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'director_description',
        value: 'Silvia, the Director of RevAdOps, has been dedicated to Ad Operations for Publishers in Digital Media since 2013. With over a decade of hands-on experience, she has successfully managed operations for publishers of all sizes, ensuring compliance, efficiency, and consistent revenue growth.',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'achievements_title',
        value: 'Her proven track record includes:',
        type: 'text'
      },

      // Achievements
      {
        section: 'about_content',
        key: 'achievement_1_number',
        value: '9000+',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'achievement_1_label',
        value: 'hours worked as a freelancer alongside with AdOps Industry experience',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'achievement_2_number',
        value: '130+',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'achievement_2_label',
        value: 'global clients served with outstanding delivery and long-term partnerships',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'achievement_3_number',
        value: '10+',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'achievement_3_label',
        value: 'years of specialized expertise in Google Ad Manager, Programmatic Monetization, and Publisher AdOps solutions',
        type: 'text'
      },
      {
        section: 'about_content',
        key: 'director_conclusion',
        value: 'Silvia\'s leadership is built on a blend of technical expertise and client-first thinking. She is passionate about helping publishers navigate the ever-changing digital advertising landscape while maintaining quality, transparency, and growth.',
        type: 'text'
      }
    ];

    // Add content if it doesn't exist
    for (const content of aboutContent) {
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

    console.log('✅ About Us content initialized successfully!');
    console.log(`Added ${aboutContent.length} content items`);

  } catch (error) {
    console.error('❌ Error initializing About Us content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
initAboutContent();
