"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export interface PostActionResult {
  success: boolean;
  error?: string;
  postId?: string;
}

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Ensure slug is unique by appending a number if necessary
 */
async function ensureUniqueSlug(baseSlug: string, excludePostId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    // If no post exists with this slug, or it's the same post we're updating, use it
    if (!existing || existing.id === excludePostId) {
      return slug;
    }

    // Otherwise, append a number and try again
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/**
 * Server action to create a new post
 */
export async function createPostAction(
  _prevState: PostActionResult | null,
  formData: FormData
): Promise<PostActionResult> {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      redirect("/login");
    }

    // Extract and validate form data
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const published = formData.get("published") === "true";

    // Validate required fields
    if (!title || !content) {
      return {
        success: false,
        error: "Title and content are required",
      };
    }

    // Validate title length
    if (title.length < 3) {
      return {
        success: false,
        error: "Title must be at least 3 characters long",
      };
    }

    if (title.length > 200) {
      return {
        success: false,
        error: "Title must be less than 200 characters",
      };
    }

    // Validate content length
    if (content.length < 10) {
      return {
        success: false,
        error: "Content must be at least 10 characters long",
      };
    }

    // Generate unique slug
    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);

    // Create the post
    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: excerpt?.trim() || null,
        published,
        publishedAt: published ? new Date() : null,
        authorId: session.userId,
      },
    });

    // Revalidate relevant paths
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/posts");
    revalidatePath("/");

    return {
      success: true,
      postId: post.id,
    };
  } catch (error) {
    console.error("Create post error:", error);
    return {
      success: false,
      error: "An error occurred while creating the post. Please try again.",
    };
  }
}

/**
 * Server action to update an existing post
 */
export async function updatePostAction(
  postId: string,
  _prevState: PostActionResult | null,
  formData: FormData
): Promise<PostActionResult> {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      redirect("/login");
    }

    // Verify post exists and user is the author
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, slug: true, published: true },
    });

    if (!existingPost) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    if (existingPost.authorId !== session.userId) {
      return {
        success: false,
        error: "You do not have permission to edit this post",
      };
    }

    // Extract and validate form data
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const published = formData.get("published") === "true";

    // Validate required fields
    if (!title || !content) {
      return {
        success: false,
        error: "Title and content are required",
      };
    }

    // Validate title length
    if (title.length < 3) {
      return {
        success: false,
        error: "Title must be at least 3 characters long",
      };
    }

    if (title.length > 200) {
      return {
        success: false,
        error: "Title must be less than 200 characters",
      };
    }

    // Validate content length
    if (content.length < 10) {
      return {
        success: false,
        error: "Content must be at least 10 characters long",
      };
    }

    // Generate unique slug if title changed
    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug, postId);

    // Determine publishedAt date
    let publishedAt = existingPost.published ? new Date() : null;
    if (published && !existingPost.published) {
      // Publishing for the first time
      publishedAt = new Date();
    } else if (!published) {
      // Unpublishing
      publishedAt = null;
    }

    // Update the post
    await prisma.post.update({
      where: { id: postId },
      data: {
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: excerpt?.trim() || null,
        published,
        publishedAt,
      },
    });

    // Revalidate relevant paths
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/posts");
    revalidatePath("/");
    revalidatePath(`/blog/${existingPost.slug}`);
    revalidatePath(`/blog/${slug}`);

    return {
      success: true,
      postId,
    };
  } catch (error) {
    console.error("Update post error:", error);
    return {
      success: false,
      error: "An error occurred while updating the post. Please try again.",
    };
  }
}

/**
 * Server action to delete a post
 */
export async function deletePostAction(postId: string): Promise<PostActionResult> {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      redirect("/login");
    }

    // Verify post exists and user is the author
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, slug: true },
    });

    if (!post) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    if (post.authorId !== session.userId) {
      return {
        success: false,
        error: "You do not have permission to delete this post",
      };
    }

    // Delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    // Revalidate relevant paths
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/posts");
    revalidatePath("/");
    revalidatePath(`/blog/${post.slug}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete post error:", error);
    return {
      success: false,
      error: "An error occurred while deleting the post. Please try again.",
    };
  }
}

/**
 * Server action to toggle post publish status
 */
export async function togglePublishAction(postId: string): Promise<PostActionResult> {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      redirect("/login");
    }

    // Verify post exists and user is the author
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, published: true, slug: true },
    });

    if (!post) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    if (post.authorId !== session.userId) {
      return {
        success: false,
        error: "You do not have permission to modify this post",
      };
    }

    // Toggle publish status
    const newPublishedStatus = !post.published;
    await prisma.post.update({
      where: { id: postId },
      data: {
        published: newPublishedStatus,
        publishedAt: newPublishedStatus ? new Date() : null,
      },
    });

    // Revalidate relevant paths
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/posts");
    revalidatePath("/");
    revalidatePath(`/blog/${post.slug}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Toggle publish error:", error);
    return {
      success: false,
      error: "An error occurred while updating the post status. Please try again.",
    };
  }
}
