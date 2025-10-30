import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: Date | null;
    author: {
      name: string | null;
      email: string;
    };
  };
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = post.publishedAt
    ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
    : "Draft";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:shadow-lg hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:shadow-zinc-800/50">
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {/* Author and Date */}
        <div className="mb-4 flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-semibold text-white">
            {post.author.name
              ? post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : post.author.email[0].toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {post.author.name || "Anonymous"}
            </span>
            <time dateTime={post.publishedAt?.toISOString()} className="text-xs">
              {formattedDate}
            </time>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-2xl font-bold leading-tight text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400 sm:text-3xl">
          <Link href={`/blog/${post.slug}`} className="outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mb-4 line-clamp-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {post.excerpt}
          </p>
        )}

        {/* Read More Link */}
        <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
          Read article
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Decorative gradient border on hover */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
    </article>
  );
}
