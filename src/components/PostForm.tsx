"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PostActionResult } from "@/actions/posts";

interface PostFormProps {
  action: (
    prevState: PostActionResult | null,
    formData: FormData
  ) => Promise<PostActionResult>;
  initialData?: {
    title: string;
    content: string;
    excerpt: string;
    published: boolean;
  };
  submitLabel?: string;
  isEditing?: boolean;
}

export default function PostForm({
  action,
  initialData = {
    title: "",
    content: "",
    excerpt: "",
    published: false,
  },
  submitLabel = "Create Post",
  isEditing = false,
}: PostFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<PostActionResult | null, FormData>(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Local state for form fields to enable character count
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [excerpt, setExcerpt] = useState(initialData.excerpt);
  const [published, setPublished] = useState(initialData.published);

  // Handle successful submission
  useEffect(() => {
    if (state?.success) {
      if (!isEditing) {
        // For new posts, reset form
        formRef.current?.reset();
        setTitle("");
        setContent("");
        setExcerpt("");
        setPublished(false);
      }

      // Navigate to posts list after a short delay to show success message
      setTimeout(() => {
        router.push("/admin/posts");
      }, 1500);
    }
  }, [state?.success, router, isEditing]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* Success Message */}
      {state?.success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20">
          <div className="flex">
            <svg
              className="h-5 w-5 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="ml-3 text-sm font-medium text-green-800 dark:text-green-200">
              Post {isEditing ? "updated" : "created"} successfully! Redirecting...
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="ml-3 text-sm font-medium text-red-800 dark:text-red-200">
              {state.error}
            </p>
          </div>
        </div>
      )}

      {/* Title Field */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          disabled={isPending}
          className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-blue-400"
          placeholder="Enter a compelling title for your post"
        />
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          {title.length}/200 characters
        </p>
      </div>

      {/* Excerpt Field */}
      <div>
        <label
          htmlFor="excerpt"
          className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Excerpt <span className="text-zinc-500">(optional)</span>
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          maxLength={300}
          disabled={isPending}
          className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-blue-400"
          placeholder="A brief summary of your post (shown in listings)"
        />
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          {excerpt.length}/300 characters
        </p>
      </div>

      {/* Content Field */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={16}
          disabled={isPending}
          className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 font-mono text-sm text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-blue-400"
          placeholder="Write your post content here... (Markdown supported)"
        />
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          {content.length} characters · Supports Markdown formatting
        </p>
      </div>

      {/* Published Checkbox */}
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <input
          type="checkbox"
          id="published"
          name="published"
          value="true"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          disabled={isPending}
          className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:ring-blue-400/20"
        />
        <label
          htmlFor="published"
          className="flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          <div>Publish immediately</div>
          <p className="mt-0.5 text-xs font-normal text-zinc-600 dark:text-zinc-400">
            {published
              ? "This post will be visible to the public"
              : "This post will be saved as a draft"}
          </p>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="rounded-lg border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || !title.trim() || !content.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
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
              {isEditing ? "Updating..." : "Creating..."}
            </span>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
