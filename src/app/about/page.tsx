import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about DevBlog and our mission to share knowledge about web development and technology.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            About DevBlog
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            A modern platform for sharing knowledge and insights
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-zinc prose-lg mx-auto dark:prose-invert">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-12">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Our Mission
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              DevBlog is a modern blogging platform built with cutting-edge web technologies.
              We're dedicated to sharing knowledge about web development, programming best
              practices, and the latest trends in technology.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              What We Cover
            </h2>
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Modern web development frameworks and tools</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Best practices in software engineering</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Tutorials and practical coding examples</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Technology trends and industry insights</span>
              </li>
            </ul>

            <h2 className="mt-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Built With
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              This platform is built using modern web technologies to ensure the best
              performance, developer experience, and user experience:
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                  Next.js 16
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  React framework with App Router for optimal performance
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                  TypeScript
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Type-safe code for better reliability
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                  Prisma
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Modern ORM for seamless database operations
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                  Tailwind CSS
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Utility-first CSS for beautiful, responsive design
                </p>
              </div>
            </div>

            <div className="mt-12 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-8 text-center dark:from-blue-950/20 dark:to-purple-950/20">
              <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Join Our Community
              </h3>
              <p className="mb-6 text-zinc-700 dark:text-zinc-300">
                Stay updated with our latest posts and connect with fellow developers
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-zinc-700 shadow-sm transition-all hover:scale-110 hover:shadow-md dark:bg-zinc-800 dark:text-zinc-300"
                  aria-label="GitHub"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-zinc-700 shadow-sm transition-all hover:scale-110 hover:shadow-md dark:bg-zinc-800 dark:text-zinc-300"
                  aria-label="Twitter"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
