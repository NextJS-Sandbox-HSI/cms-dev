# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DevBlog CMS** is a full-stack Next.js application designed as a learning project. It serves two main purposes:

1. **Public-Facing Blog**: A fast, SEO-friendly blog where visitors can read articles
2. **Admin Dashboard**: A secure area for authenticated admins to create, read, update, and delete blog posts

This is an educational project structured around a 16-part learning path covering fundamental to advanced Next.js concepts.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Database commands
npm run db:generate    # Generate Prisma Client
npm run db:push        # Push schema changes (no migrations)
npm run db:migrate     # Create and apply migrations
npm run db:studio      # Open Prisma Studio (visual DB browser)
npm run db:seed        # Seed database with sample data
```

## Technology Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **Runtime**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database ORM**: Prisma 6.18.0 (with Accelerate extension)
- **Compiler**: React Compiler (enabled in next.config.ts)
- **Font Optimization**: next/font (Geist Sans & Geist Mono)

## Project Structure

```
cms-dev/
├── src/
│   ├── app/              # Next.js App Router directory
│   │   ├── layout.tsx    # Root layout with font configuration
│   │   ├── page.tsx      # Homepage component
│   │   └── globals.css   # Global Tailwind styles
│   ├── lib/              # Utility functions and shared code
│   │   └── prisma.ts     # Prisma Client singleton
│   └── generated/        # Auto-generated files
│       └── prisma/       # Generated Prisma Client (do not edit)
├── prisma/
│   ├── schema.prisma     # Database schema definition
│   ├── seed.ts           # Database seeding script
│   ├── migrations/       # Migration history (created after first migration)
│   └── README.md         # Prisma setup documentation
├── public/               # Static assets
└── components/           # Reusable React components (to be created)
```

## Key Architecture Decisions

### Next.js App Router
- Uses the modern App Router (not Pages Router)
- File-based routing inside `src/app/`
- Server Components by default; Client Components require `"use client"` directive

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)
- Use `@/components/*` instead of relative imports for components

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- JSX mode: react-jsx (for React 19)
- Module resolution: bundler

### React Compiler
- React Compiler is enabled (experimental feature)
- Automatically optimizes React components at build time

## Planned Route Structure

When implementing routing, follow this structure:

- `/` - Homepage listing all blog posts (Server Component)
- `/blog/[slug]` - Individual blog post detail page (Server Component with dynamic routing)
- `/login` - Admin login page (Client Component with form)
- `/admin/dashboard` - Admin dashboard (protected route, Server Component)
- `/admin/posts/new` - Create new post (Client Component with form)
- `/admin/posts/edit/[id]` - Edit existing post (Client Component with form)

## Component Guidelines

### Server vs Client Components
- **Server Components** (default): Use for data fetching, static content, SEO-critical pages
  - Homepage
  - Blog detail pages
  - Admin dashboard layout
- **Client Components** (`"use client"`): Use for interactivity, hooks, browser APIs
  - Forms (LoginForm, PostForm)
  - Search functionality
  - Interactive UI elements

### Planned Components
Create these in a `components/` directory:
- `Navbar.tsx` - Site navigation
- `Footer.tsx` - Site footer
- `PostCard.tsx` - Blog post summary card
- `PostForm.tsx` - Form for creating/editing posts (Client Component)
- `LoginForm.tsx` - Admin login form (Client Component)

## Database & Authentication

### Prisma Setup ✅ Configured
- **Schema location**: `prisma/schema.prisma`
- **Generated Client**: `src/generated/prisma/` (do not edit)
- **Singleton**: Always import from `@/lib/prisma` to avoid connection pool issues
- **Models**:
  - `User`: Admin authentication (id, email, password, name, posts relation)
  - `Post`: Blog content (id, title, slug, content, excerpt, published, publishedAt, author relation)
- **Indexes**: Configured on `slug`, `published`, and `authorId` for optimal query performance
- **Prisma Accelerate**: Supported via `DATABASE_URL` and `DIRECT_URL` in `.env`

**Database Workflow**:
```typescript
// Always use the singleton
import { prisma } from "@/lib/prisma";

// Example: Fetch published posts
const posts = await prisma.post.findMany({
  where: { published: true },
  include: { author: true },
  orderBy: { publishedAt: "desc" },
});
```

**Important**: See `prisma/README.md` for detailed setup instructions, best practices, and examples.

### Authentication (Planned)
- NextAuth.js v5 will be used for authentication
- Credentials provider for email/password login
- **Security**: Always hash passwords with bcrypt (seed.ts shows placeholder only)
- Middleware to protect `/admin/*` routes
- Session management via Context API or Zustand

## Server Actions

The project will use Server Actions (not traditional API routes) for form handling:
- `loginAction(formData)` - User authentication
- `logoutAction()` - User logout
- `createPostAction(formData)` - Create blog post
- `updatePostAction(postId, formData)` - Update blog post
- `deletePostAction(postId)` - Delete blog post

Server Actions should use `revalidatePath()` to refresh data and `redirect()` for navigation after mutations.

## Styling Approach

- Tailwind CSS 4 utility classes
- Dark mode support built in (via Tailwind)
- Responsive design using Tailwind breakpoints (sm, md, lg, xl)
- Font variables: `--font-geist-sans` and `--font-geist-mono`

## Performance Considerations

- Use `next/image` for all images (automatic optimization)
- Use `next/font` for font optimization (already configured)
- Implement data caching with `revalidatePath()` after mutations
- Consider implementing ISR (Incremental Static Regeneration) for blog posts

## Learning Path Context

This project follows a structured 16-part curriculum:
1. Next.js ecosystem and setup
2. Routing & page layouts
3. Components & styling
4. State & basic hooks
5. Client-side data fetching
6. Server-side data fetching
7. Server vs Client Components
8. Context API & global state
9. API Routes/Server Actions
10. Database connection
11. Authentication
12. Frontend/Backend integration
13. Zustand state management
14. Performance optimization
15. Deployment
16. Showcase and review

When implementing features, reference this learning path to ensure alignment with educational goals.
