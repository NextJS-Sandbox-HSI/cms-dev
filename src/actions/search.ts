"use server";

import { prisma } from "@/lib/prisma";

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
}

/**
 * Search published posts by title or content
 */
export async function searchPosts(query: string): Promise<SearchResult[]> {
  try {
    if (!query || query.length < 2) {
      return [];
    }

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            excerpt: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 10, // Limit to 10 results for performance
    });

    return posts;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
