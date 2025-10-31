# DevBlog CMS - Implementation TODO List

This document outlines the implementation plans for two major features:
1. Zod Schema Validation
2. Ctrl + K Command Palette / Search

---

## Part 1: Zod Schema Validation Implementation

### Overview
Implement comprehensive Zod schema validation across the application to ensure type-safe data validation at runtime, improve error handling, and provide better user feedback.

### Prerequisites
- [x] Prisma schema already defined
- [x] Server Actions implemented
- [x] Forms implemented (LoginForm, PostForm)

---

### Phase 1: Setup & Dependencies

#### 1.1 Install Dependencies
```bash
npm install zod
npm install @hookform/resolvers react-hook-form
```

**Packages:**
- `zod` - Core validation library
- `react-hook-form` - Form state management (best practice for React forms)
- `@hookform/resolvers` - Bridge between React Hook Form and Zod

**Why?**
- Zod provides runtime type safety that complements TypeScript
- React Hook Form reduces re-renders and provides excellent UX
- Combining them is industry standard for production apps

---

### Phase 2: Create Zod Schemas

#### 2.1 Create Schema Directory Structure
```
src/
├── schemas/
│   ├── index.ts           # Re-export all schemas
│   ├── auth.schema.ts     # Authentication schemas
│   ├── post.schema.ts     # Post schemas
│   └── common.schema.ts   # Shared/reusable schemas
```

#### 2.2 Create Authentication Schemas (`src/schemas/auth.schema.ts`)
```typescript
import { z } from "zod";

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Register schema (for future use)
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim()
    .optional(),
});

// Type inference
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

#### 2.3 Create Post Schemas (`src/schemas/post.schema.ts`)
```typescript
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
  published: z.boolean().default(false),
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
```

#### 2.4 Create Common Schemas (`src/schemas/common.schema.ts`)
```typescript
import { z } from "zod";

// Email validation (reusable)
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .toLowerCase()
  .trim();

// Slug validation
export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

// CUID validation (used for IDs)
export const cuidSchema = z.string().cuid();

// Date schema
export const dateSchema = z.coerce.date();
```

#### 2.5 Create Index File (`src/schemas/index.ts`)
```typescript
// Re-export all schemas for easy imports
export * from "./auth.schema";
export * from "./post.schema";
export * from "./common.schema";
```

---

### Phase 3: Update Server Actions with Validation

#### 3.1 Update Authentication Actions (`src/actions/auth.ts`)

**Before:**
```typescript
const email = formData.get("email") as string;
const password = formData.get("password") as string;

if (!email || !password) {
  return { success: false, error: "Email and password are required" };
}
```

**After:**
```typescript
import { loginSchema } from "@/schemas";

// Extract and validate
const rawData = {
  email: formData.get("email"),
  password: formData.get("password"),
};

const validation = loginSchema.safeParse(rawData);

if (!validation.success) {
  return {
    success: false,
    error: validation.error.errors[0].message,
    fieldErrors: validation.error.flatten().fieldErrors,
  };
}

const { email, password } = validation.data;
```

#### 3.2 Update Post Actions (`src/actions/posts.ts`)

**Update `createPostAction`:**
```typescript
import { postSchema } from "@/schemas";

export async function createPostAction(
  _prevState: PostActionResult | null,
  formData: FormData
): Promise<PostActionResult> {
  try {
    const session = await getSession();
    if (!session) {
      redirect("/login");
    }

    // Extract raw data
    const rawData = {
      title: formData.get("title"),
      content: formData.get("content"),
      excerpt: formData.get("excerpt") || "",
      published: formData.get("published") === "true",
    };

    // Validate with Zod
    const validation = postSchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message,
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const { title, content, excerpt, published } = validation.data;

    // Generate unique slug
    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        published,
        publishedAt: published ? new Date() : null,
        authorId: session.userId,
      },
    });

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
```

**Update `getPaginatedPosts`:**
```typescript
import { paginationSchema } from "@/schemas";

export async function getPaginatedPosts(
  page: number = 0,
  pageSize: number = 20
): Promise<PaginatedPostsResult> {
  try {
    // Validate pagination parameters
    const validation = paginationSchema.safeParse({ page, pageSize });

    if (!validation.success) {
      console.error("Invalid pagination parameters:", validation.error);
      return { posts: [], hasMore: false };
    }

    const { page: validPage, pageSize: validPageSize } = validation.data;
    const skip = validPage * validPageSize;

    // ... rest of the function
  } catch (error) {
    console.error("Get paginated posts error:", error);
    return { posts: [], hasMore: false };
  }
}
```

#### 3.3 Update Action Result Types

**Update `PostActionResult` interface:**
```typescript
export interface PostActionResult {
  success: boolean;
  error?: string;
  postId?: string;
  fieldErrors?: {
    title?: string[];
    content?: string[];
    excerpt?: string[];
    published?: string[];
  };
}

export interface LoginResult {
  success: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
}
```

---

### Phase 4: Update Forms with React Hook Form + Zod

#### 4.1 Update LoginForm (`src/components/LoginForm.tsx`)

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/schemas";
import { loginAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // Validate on blur for better UX
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await loginAction(null, formData);

      if (result.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setServerError(result.error || "Login failed");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Server Error */}
      {serverError && (
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/20">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {serverError}
          </p>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50"
        >
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          disabled={isPending}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          placeholder="admin@example.com"
          autoComplete="email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50"
        >
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          disabled={isPending}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-zinc-900"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
```

#### 4.2 Update PostForm (`src/components/PostForm.tsx`)

Similar pattern - use `useForm` with `zodResolver(postSchema)` and display field-level errors.

---

### Phase 5: Create Validation Utilities

#### 5.1 Create Validation Helper (`src/lib/validation.ts`)

```typescript
import { z } from "zod";

/**
 * Validates data against a Zod schema and returns formatted errors
 */
export function validateData<T>(
  schema: z.Schema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Format errors for easy consumption
  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join(".");
    errors[path] = error.message;
  });

  return { success: false, errors };
}

/**
 * Extract FormData into a plain object
 */
export function formDataToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    // Handle checkboxes and multiple values
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        (obj[key] as unknown[]).push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  });

  return obj;
}
```

---

### Phase 6: Testing & Error Handling

#### 6.1 Test Cases to Implement

- [ ] Test login with invalid email format
- [ ] Test login with missing password
- [ ] Test post creation with title < 3 characters
- [ ] Test post creation with content < 10 characters
- [ ] Test post creation with excerpt > 500 characters
- [ ] Test pagination with invalid page numbers
- [ ] Test pagination with page size > 100

#### 6.2 Error Display Best Practices

✓ Show field-level errors immediately below inputs
✓ Show server errors at the form level
✓ Use accessible ARIA labels for errors
✓ Clear errors when user starts typing (handled by React Hook Form)
✓ Disable submit button during validation/submission

---

### Phase 7: Documentation

#### 7.1 Create Validation Guide (`docs/VALIDATION.md`)

Document:
- How to create new schemas
- How to use schemas in Server Actions
- How to integrate with forms
- Common validation patterns
- Troubleshooting

---

## Part 2: Ctrl + K Command Palette / Search Implementation

### Overview
Implement a command palette (Ctrl+K / Cmd+K) for quick navigation and search across the application, following modern UX patterns like GitHub, Linear, and Vercel.

---

### Phase 1: Setup & Dependencies

#### 1.1 Install Dependencies
```bash
npm install cmdk
npm install @radix-ui/react-dialog
```

**Packages:**
- `cmdk` - Command palette component by Paco (used by Vercel, Linear, etc.)
- `@radix-ui/react-dialog` - Accessible dialog primitive

**Why?**
- `cmdk` is the industry standard for command palettes
- Used by major companies (Vercel, Linear, GitHub)
- Excellent keyboard navigation and accessibility
- Flexible and customizable

---

### Phase 2: Create Command Palette Component

#### 2.1 Create Component Structure
```
src/
├── components/
│   ├── CommandPalette/
│   │   ├── CommandPalette.tsx       # Main component
│   │   ├── CommandSearch.tsx        # Search logic
│   │   ├── CommandGroups.tsx        # Group items (Pages, Posts, Actions)
│   │   └── useCommandPalette.tsx    # Custom hook for state
```

#### 2.2 Create Main Component (`src/components/CommandPalette/CommandPalette.tsx`)

```typescript
"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useCommandPalette } from "./useCommandPalette";
import "./command-palette.css"; // Custom styles

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, setIsOpen } = useCommandPalette();
  const [search, setSearch] = React.useState("");

  // Keyboard shortcut: Ctrl+K or Cmd+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setIsOpen]);

  const handleSelect = (callback: () => void) => {
    setIsOpen(false);
    callback();
  };

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={() => setIsOpen(false)}>
      <Command.Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        label="Command Menu"
        className="command-palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="command-header">
          <svg className="command-icon" width="15" height="15" viewBox="0 0 15 15">
            <path
              d="M10 6.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM6.5 0a6.5 6.5 0 104.936 10.73l3.417 3.417a.5.5 0 00.707-.707l-3.417-3.417A6.5 6.5 0 006.5 0z"
              fill="currentColor"
            />
          </svg>
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search posts, navigate pages..."
            className="command-input"
          />
        </div>

        <Command.List className="command-list">
          <Command.Empty className="command-empty">
            No results found for "{search}"
          </Command.Empty>

          {/* Navigation Group */}
          <Command.Group heading="Navigation" className="command-group">
            <Command.Item
              onSelect={() => handleSelect(() => router.push("/"))}
              className="command-item"
            >
              <span className="command-item-icon">🏠</span>
              <span>Home</span>
              <kbd className="command-kbd">H</kbd>
            </Command.Item>
            <Command.Item
              onSelect={() => handleSelect(() => router.push("/about"))}
              className="command-item"
            >
              <span className="command-item-icon">ℹ️</span>
              <span>About</span>
            </Command.Item>
            <Command.Item
              onSelect={() => handleSelect(() => router.push("/admin/dashboard"))}
              className="command-item"
            >
              <span className="command-item-icon">📊</span>
              <span>Admin Dashboard</span>
              <kbd className="command-kbd">D</kbd>
            </Command.Item>
            <Command.Item
              onSelect={() => handleSelect(() => router.push("/admin/posts/new"))}
              className="command-item"
            >
              <span className="command-item-icon">➕</span>
              <span>New Post</span>
              <kbd className="command-kbd">N</kbd>
            </Command.Item>
          </Command.Group>

          {/* Posts Group - Dynamic */}
          <PostSearchGroup search={search} onSelect={handleSelect} />

          {/* Actions Group */}
          <Command.Group heading="Actions" className="command-group">
            <Command.Item
              onSelect={() => handleSelect(() => router.push("/login"))}
              className="command-item"
            >
              <span className="command-item-icon">🔐</span>
              <span>Login</span>
            </Command.Item>
            <Command.Item
              onSelect={() => {
                setIsOpen(false);
                window.location.reload();
              }}
              className="command-item"
            >
              <span className="command-item-icon">🔄</span>
              <span>Reload Page</span>
            </Command.Item>
          </Command.Group>
        </Command.List>

        <div className="command-footer">
          <span className="command-footer-text">
            Navigate with <kbd>↑</kbd> <kbd>↓</kbd> • Select with <kbd>↵</kbd> • Close with <kbd>ESC</kbd>
          </span>
        </div>
      </Command.Dialog>
    </div>
  );
}
```

#### 2.3 Create Custom Hook (`src/components/CommandPalette/useCommandPalette.tsx`)

```typescript
import { create } from "zustand";

interface CommandPaletteStore {
  isOpen: boolean;
  setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

export const useCommandPalette = create<CommandPaletteStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) =>
    set((state) => ({
      isOpen: typeof open === "function" ? open(state.isOpen) : open,
    })),
}));
```

**Note:** If Zustand is not installed yet:
```bash
npm install zustand
```

#### 2.4 Create Post Search Component (`src/components/CommandPalette/CommandSearch.tsx`)

```typescript
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
```

---

### Phase 3: Create Search Server Action

#### 3.1 Create Search Action (`src/actions/search.ts`)

```typescript
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
```

---

### Phase 4: Styling

#### 4.1 Create Styles (`src/components/CommandPalette/command-palette.css`)

```css
/* Overlay */
.command-palette-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
  animation: fadeIn 150ms ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Command Palette Container */
.command-palette {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 640px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideIn 200ms ease-out;
}

@media (prefers-color-scheme: dark) {
  .command-palette {
    background: #18181b;
    border: 1px solid #27272a;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Header */
.command-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #e4e4e7;
}

@media (prefers-color-scheme: dark) {
  .command-header {
    border-bottom-color: #27272a;
  }
}

.command-icon {
  color: #71717a;
  flex-shrink: 0;
}

.command-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #18181b;
}

@media (prefers-color-scheme: dark) {
  .command-input {
    color: #fafafa;
  }
}

.command-input::placeholder {
  color: #a1a1aa;
}

/* List */
.command-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

/* Group */
.command-group {
  margin-bottom: 8px;
}

.command-group [cmdk-group-heading] {
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Item */
.command-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #18181b;
  transition: all 100ms;
}

@media (prefers-color-scheme: dark) {
  .command-item {
    color: #fafafa;
  }
}

.command-item[aria-selected="true"] {
  background: #f4f4f5;
}

@media (prefers-color-scheme: dark) {
  .command-item[aria-selected="true"] {
    background: #27272a;
  }
}

.command-item-icon {
  font-size: 18px;
  flex-shrink: 0;
}

/* Keyboard shortcuts */
.command-kbd {
  margin-left: auto;
  padding: 4px 8px;
  background: #e4e4e7;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #52525b;
}

@media (prefers-color-scheme: dark) {
  .command-kbd {
    background: #27272a;
    color: #a1a1aa;
  }
}

/* Empty state */
.command-empty {
  padding: 32px;
  text-align: center;
  color: #71717a;
  font-size: 14px;
}

/* Footer */
.command-footer {
  padding: 12px 16px;
  border-top: 1px solid #e4e4e7;
  background: #fafafa;
}

@media (prefers-color-scheme: dark) {
  .command-footer {
    border-top-color: #27272a;
    background: #09090b;
  }
}

.command-footer-text {
  font-size: 12px;
  color: #71717a;
}

.command-footer kbd {
  padding: 2px 6px;
  background: white;
  border: 1px solid #e4e4e7;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

@media (prefers-color-scheme: dark) {
  .command-footer kbd {
    background: #18181b;
    border-color: #27272a;
  }
}

/* Loading */
.command-loading {
  padding: 12px;
  text-align: center;
  color: #71717a;
  font-size: 14px;
}
```

---

### Phase 5: Integration

#### 5.1 Add to Root Layout (`src/app/layout.tsx`)

```typescript
import { CommandPalette } from "@/components/CommandPalette/CommandPalette";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
```

#### 5.2 Optional: Add Trigger Button (for discoverability)

Add a button in the navbar:
```typescript
<button
  onClick={() => setIsOpen(true)}
  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
>
  <span>Search</span>
  <kbd className="text-xs">⌘K</kbd>
</button>
```

---

### Phase 6: Advanced Features (Optional)

#### 6.1 Recent Searches (localStorage)
- Store recent searches in localStorage
- Display them when command palette opens with no query

#### 6.2 Keyboard Shortcuts for Items
- Add single-key shortcuts (H for Home, D for Dashboard, etc.)
- Implement in the keyboard event handler

#### 6.3 Admin-Only Actions
- Check authentication status
- Show admin actions only to logged-in users

#### 6.4 Full-Text Search (PostgreSQL)
- Implement PostgreSQL full-text search for better relevance
- Add search ranking

```sql
-- Add full-text search index
CREATE INDEX posts_search_idx ON posts USING GIN (
  to_tsvector('english', title || ' ' || content)
);
```

#### 6.5 Search Analytics
- Track popular searches
- Improve search quality over time

---

## Implementation Order

### Recommended Sequence:

1. **Zod Validation** (1-2 days)
   - Phase 1-2: Install dependencies and create schemas
   - Phase 3: Update Server Actions
   - Phase 4: Update forms with React Hook Form
   - Phase 5-7: Utilities, testing, documentation

2. **Command Palette** (1 day)
   - Phase 1-2: Install dependencies and create component
   - Phase 3: Create search action
   - Phase 4-5: Styling and integration
   - Phase 6: Advanced features (optional)

### Total Estimated Time: 2-3 days

---

## Testing Checklist

### Zod Validation
- [ ] All forms validate on client-side before submission
- [ ] Server Actions reject invalid data
- [ ] Error messages are user-friendly
- [ ] Field errors display correctly
- [ ] Edge cases handled (empty strings, special characters, etc.)

### Command Palette
- [ ] Opens with Ctrl+K / Cmd+K
- [ ] Closes with ESC
- [ ] Navigation works with arrow keys
- [ ] Selection works with Enter
- [ ] Search debounces properly
- [ ] Results are accurate
- [ ] Works on all pages
- [ ] Mobile-friendly (optional: use different trigger)

---

## Best Practices Followed

### Zod Validation
✓ Schemas co-located in dedicated directory
✓ Type inference for TypeScript safety
✓ Reusable schema composition
✓ Consistent error handling
✓ Client + Server validation (defense in depth)
✓ Accessible error messages

### Command Palette
✓ Industry-standard library (cmdk)
✓ Keyboard-first navigation
✓ Accessible (ARIA labels, focus management)
✓ Performance optimized (debouncing, result limits)
✓ Progressive enhancement
✓ Dark mode support
✓ Responsive design

---

## Resources

### Zod
- [Zod Documentation](https://zod.dev/)
- [React Hook Form + Zod](https://react-hook-form.com/get-started#SchemaValidation)
- [Zod Error Handling](https://zod.dev/ERROR_HANDLING)

### Command Palette
- [cmdk Documentation](https://cmdk.paco.me/)
- [Vercel's Command Menu](https://vercel.com/design/command-menu)
- [Linear's Command K](https://linear.app/docs/keyboard-shortcuts)
- [GitHub Command Palette](https://docs.github.com/en/get-started/using-github/github-command-palette)

---

**Last Updated:** 2025-10-31
**Status:** Ready for Implementation
