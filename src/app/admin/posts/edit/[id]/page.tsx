import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { updatePostAction } from "@/actions/posts";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/PostForm";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edit Post - Admin",
  description: "Edit an existing blog post",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  // Check authentication
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Get post ID from params
  const { id } = await params;

  // Fetch the post
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      published: true,
      authorId: true,
    },
  });

  // Check if post exists
  if (!post) {
    notFound();
  }

  // Check if user is the author
  if (post.authorId !== session.userId) {
    redirect("/admin/posts");
  }

  // Bind the post ID to the update action
  const updatePostWithId = updatePostAction.bind(null, id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Posts
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Edit Post
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Update your blog post
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <PostForm
            action={updatePostWithId}
            initialData={{
              title: post.title,
              content: post.content,
              excerpt: post.excerpt || "",
              published: post.published,
            }}
            submitLabel="Update Post"
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
}
