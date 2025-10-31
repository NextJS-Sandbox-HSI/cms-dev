import { z } from "zod";

// Create/Update post schema
export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .trim(),
  excerpt: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  published: z.boolean().optional(),
});

// Schema for updating existing post (all fields optional except those required)
export const updatePostSchema = postSchema.partial();

// Schema for post ID parameter
export const postIdSchema = z.object({
  id: z.string().cuid("Invalid post ID"),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().min(0).default(0),
  pageSize: z.number().int().min(1).max(100).default(20),
});

// Type inference
export type PostInput = z.infer<typeof postSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostIdInput = z.infer<typeof postIdSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
