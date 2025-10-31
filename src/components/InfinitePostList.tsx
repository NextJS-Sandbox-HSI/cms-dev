"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PostCard } from "./PostCard";
import { getPaginatedPosts } from "@/actions/posts";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  author: {
    name: string | null;
    email: string;
  };
}

interface InfinitePostListProps {
  initialPosts: Post[];
  initialHasMore: boolean;
}

export function InfinitePostList({ initialPosts, initialHasMore }: InfinitePostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1); // Start at page 1 since page 0 is already loaded
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Function to load more posts
  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const result = await getPaginatedPosts(page, 20);

      // Append new posts to existing posts
      setPosts((prevPosts) => [...prevPosts, ...result.posts]);
      setHasMore(result.hasMore);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading]);

  // Setup Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // When the target element is visible in viewport
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts();
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "100px", // Start loading 100px before reaching the element
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMorePosts, hasMore, isLoading]);

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 py-24 dark:border-zinc-700 dark:bg-zinc-900/50">
        <svg
          className="mb-4 h-16 w-16 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          No posts yet
        </h3>
        <p className="text-center text-zinc-600 dark:text-zinc-400">
          Check back soon for new content!
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-12 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
        Latest Articles
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Loading indicator and intersection observer target */}
      <div ref={observerTarget} className="mt-12 flex justify-center">
        {isLoading && (
          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <svg
              className="h-6 w-6 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm font-medium">Loading more articles...</span>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            You've reached the end!
          </p>
        )}
      </div>
    </>
  );
}
