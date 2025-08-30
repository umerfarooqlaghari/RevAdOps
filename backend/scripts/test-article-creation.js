import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testArticleCreation() {
  try {
    console.log('Testing article creation...');

    const testPayload = {
      title: "Product base vs Service base",
      slug: "productvsService",
      excerpt: "Service-Based vs Product-Based Business Models",
      content: "<p data-start=\"122\" data-end=\"795\">Service-based businesses focus on delivering expertise, skills, or labor to meet client needs. Examples include consulting, software development, and healthcare services. Their value lies in customization, relationships, and ongoing support. On the other hand, product-based businesses create tangible or digital products that can be repeatedly sold, such as electronics, packaged food, or SaaS platforms. They rely heavily on scalability, distribution, and innovation. While service models offer flexibility and strong client bonds, product models excel in mass reach and automation. Choosing between them depends on goals, resources, and long-term scalability strategy.</p>\n<p data-start=\"797\" data-end=\"862\" data-is-last-node=\"\" data-is-only-node=\"\"></p>",
      featuredImage: "https://res.cloudinary.com/dp6u85kkx/image/upload/v1756509725/revadops/hixjtfpudg8c1ewhcown.jpg",
      author: "RevAdOps Team",
      metaDescription: "Discover the key differences between service-based and product-based business models, their advantages, and which one suits your growth strategy.",
      status: "published",
      categoryId: "",
      tags: ["Service", "Product", "Startup"],
      isPublished: true,
      publishedAt: "2025-08-29T23:22:53.992Z"
    };

    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug: testPayload.slug }
    });

    if (existingBlog) {
      console.log('❌ Article with this slug already exists. Deleting it first...');
      await prisma.blog.delete({
        where: { slug: testPayload.slug }
      });
    }

    // Create the article
    const blog = await prisma.blog.create({
      data: {
        title: testPayload.title,
        content: testPayload.content,
        slug: testPayload.slug,
        excerpt: testPayload.excerpt,
        categoryId: testPayload.categoryId || null,
        tags: testPayload.tags || [],
        featuredImage: testPayload.featuredImage,
        author: testPayload.author || 'RevAdOps Team',
        metaDescription: testPayload.metaDescription || testPayload.excerpt || testPayload.title,
        status: testPayload.status || 'draft',
        isPublished: testPayload.isPublished || false,
        publishedAt: testPayload.isPublished && testPayload.publishedAt 
          ? new Date(testPayload.publishedAt) 
          : (testPayload.isPublished ? new Date() : null),
        viewCount: 0
      },
      include: {
        category: true
      }
    });

    console.log('✅ Article created successfully!');
    console.log('Article details:');
    console.log(`- ID: ${blog.id}`);
    console.log(`- Title: ${blog.title}`);
    console.log(`- Slug: ${blog.slug}`);
    console.log(`- Author: ${blog.author}`);
    console.log(`- Status: ${blog.status}`);
    console.log(`- Published: ${blog.isPublished}`);
    console.log(`- Published At: ${blog.publishedAt}`);
    console.log(`- Tags: ${blog.tags.join(', ')}`);
    console.log(`- URL: /blog/${blog.slug}`);

  } catch (error) {
    console.error('❌ Error creating article:', error);
    console.error('Error details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
testArticleCreation();
