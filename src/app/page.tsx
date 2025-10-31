import { prisma } from "@/lib/prisma";
import { InfinitePostList } from "@/components/InfinitePostList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Explore our latest blog posts on web development, programming, and technology.",
};

const POSTS_PER_PAGE = 20;

export default async function Home() {
  // Fetch initial batch of published posts (first page)
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: POSTS_PER_PAGE + 1, // Fetch one extra to check if there are more
  });

  // Check if there are more posts beyond the initial page
  const hasMore = posts.length > POSTS_PER_PAGE;
  const initialPosts = hasMore ? posts.slice(0, POSTS_PER_PAGE) : posts;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-60 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
              Welcome to DevBlog
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-2xl">
              Discover insightful articles on web development, programming best practices, and the latest in technology.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <div className="flex items-center justify-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>{initialPosts.length} {initialPosts.length === 1 ? 'article' : 'articles'} published</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <InfinitePostList initialPosts={initialPosts} initialHasMore={hasMore} />
      </section>
    </div>
  );
}
