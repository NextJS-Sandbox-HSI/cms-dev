import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create a demo admin user
  // Note: In production, you should hash passwords using bcrypt or similar
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: "demo-password-please-hash-in-production",
      name: "Admin User",
    },
  });

  console.log("✅ Created user:", user.email);

  // Create demo blog posts
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: "welcome-to-devblog" },
      update: {},
      create: {
        title: "Welcome to DevBlog CMS",
        slug: "welcome-to-devblog",
        content: `# Welcome to DevBlog CMS

This is your first blog post! This CMS is built with Next.js, TypeScript, and Prisma.

## Features

- Modern Next.js App Router
- TypeScript for type safety
- Prisma for database management
- Server Actions for backend logic
- Tailwind CSS for styling

Start editing this post or create new ones from the admin dashboard!`,
        excerpt: "Your first blog post in DevBlog CMS",
        published: true,
        publishedAt: new Date(),
        authorId: user.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: "getting-started-with-nextjs" },
      update: {},
      create: {
        title: "Getting Started with Next.js",
        slug: "getting-started-with-nextjs",
        content: `# Getting Started with Next.js

Next.js is a powerful React framework that makes building web applications a breeze.

## Why Next.js?

- Server-side rendering out of the box
- File-based routing
- API routes
- Excellent performance
- Great developer experience

This blog is built with Next.js 16 and showcases many of its features!`,
        excerpt: "Learn the basics of Next.js framework",
        published: true,
        publishedAt: new Date(),
        authorId: user.id,
      },
    }),
    prisma.post.upsert({
      where: { slug: "draft-post-example" },
      update: {},
      create: {
        title: "This is a Draft Post",
        slug: "draft-post-example",
        content: "This post is not published yet. Only visible in the admin dashboard.",
        excerpt: "An example of an unpublished draft post",
        published: false,
        authorId: user.id,
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} blog posts`);
  console.log("🎉 Database seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
