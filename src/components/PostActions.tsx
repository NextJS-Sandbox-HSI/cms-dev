"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePostAction, togglePublishAction } from "@/actions/posts";
import Link from "next/link";

interface PostActionsProps {
  postId: string;
  postTitle: string;
  isPublished: boolean;
}

export default function PostActions({
  postId,
  postTitle,
  isPublished,
}: PostActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTogglePublish = () => {
    setError(null);
    startTransition(async () => {
      const result = await togglePublishAction(postId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Failed to update post status");
      }
    });
  };

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deletePostAction(postId);
      if (result.success) {
        router.refresh();
        setShowDeleteConfirm(false);
      } else {
        setError(result.error || "Failed to delete post");
        setShowDeleteConfirm(false);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-2 dark:border-red-900/50 dark:bg-red-900/20">
          <p className="text-xs text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Edit Button */}
        <Link
          href={`/admin/posts/edit/${postId}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </Link>

        {/* Toggle Publish Button */}
        <button
          onClick={handleTogglePublish}
          disabled={isPending}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            isPublished
              ? "border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
              : "border-green-300 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
          }`}
        >
          {isPending ? (
            <svg
              className="h-3.5 w-3.5 animate-spin"
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
          ) : isPublished ? (
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          ) : (
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
          {isPublished ? "Unpublish" : "Publish"}
        </button>

        {/* Delete Button */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 dark:border-red-900/50 dark:bg-red-900/20">
            <span className="text-xs font-medium text-red-700 dark:text-red-400">
              Confirm?
            </span>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="text-xs font-medium text-red-700 underline hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
            >
              Yes
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isPending}
              className="text-xs font-medium text-zinc-600 underline hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
