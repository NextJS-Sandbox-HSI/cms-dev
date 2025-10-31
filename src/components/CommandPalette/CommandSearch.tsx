"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { searchPosts } from "@/actions/search";

interface PostSearchGroupProps {
  search: string;
  onSelect: (callback: () => void) => void;
}

export function PostSearchGroup({ search, onSelect }: PostSearchGroupProps) {
  const router = useRouter();
  const [posts, setPosts] = React.useState<
    Array<{ id: string; title: string; slug: string }>
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!search || search.length < 2) {
      setPosts([]);
      return;
    }

    const debounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchPosts(search);
        setPosts(results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(debounce);
  }, [search]);

  if (!search || search.length < 2) return null;

  return (
    <Command.Group heading="Posts" className="command-group">
      {isLoading ? (
        <div className="command-loading">Searching...</div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <Command.Item
            key={post.id}
            value={post.title}
            onSelect={() => onSelect(() => router.push(`/blog/${post.slug}`))}
            className="command-item"
          >
            <span className="command-item-icon">📄</span>
            <span>{post.title}</span>
          </Command.Item>
        ))
      ) : (
        <div className="command-empty-group">No posts found</div>
      )}
    </Command.Group>
  );
}
