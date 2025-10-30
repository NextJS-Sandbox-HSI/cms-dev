# Prisma Database Setup

This directory contains all Prisma-related files for the DevBlog CMS project.

## Files Structure

```
prisma/
├── schema.prisma      # Database schema definition
├── seed.ts           # Database seeding script
├── migrations/       # Database migration history (created after first migration)
└── README.md         # This file
```

## Database Schema

### Models

**User Model**
- Stores admin user credentials for authentication
- Fields: id, email, password, name, createdAt, updatedAt
- Relations: One-to-many with Posts

**Post Model**
- Stores blog post content
- Fields: id, title, slug, content, excerpt, published, publishedAt, authorId, createdAt, updatedAt
- Relations: Many-to-one with User
- Indexes: authorId, slug, published (for query performance)

## Setup Instructions

### 1. Configure Database Connection

Update the `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

**Local Development Options:**
- Local PostgreSQL server
- Docker PostgreSQL container
- [Neon](https://neon.tech) (free tier available)
- [Supabase](https://supabase.com) (free tier available)
- [Railway](https://railway.app)

### 2. Run Database Migrations

For new databases, use `db:push` (faster for development):
```bash
npm run db:push
```

For production or when you want migration history:
```bash
npm run db:migrate
```

This will:
- Create the database tables
- Apply the schema changes
- Generate migration files (if using migrate)

### 3. Generate Prisma Client

```bash
npm run db:generate
```

This generates the TypeScript types and Prisma Client based on your schema.

### 4. Seed the Database (Optional)

Populate the database with sample data:
```bash
npm run db:seed
```

This creates:
- 1 demo admin user (email: admin@example.com)
- 3 sample blog posts (2 published, 1 draft)

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `db:generate` | `prisma generate` | Generate Prisma Client |
| `db:push` | `prisma db push` | Push schema changes to database (no migrations) |
| `db:migrate` | `prisma migrate dev` | Create and apply migrations |
| `db:studio` | `prisma studio` | Open Prisma Studio (visual database browser) |
| `db:seed` | `tsx prisma/seed.ts` | Seed database with sample data |

## Using Prisma in Your Code

### Import the Prisma Client

```typescript
import { prisma } from "@/lib/prisma";
```

### Example Queries

**Find all published posts:**
```typescript
const posts = await prisma.post.findMany({
  where: { published: true },
  include: { author: true },
  orderBy: { publishedAt: "desc" },
});
```

**Create a new post:**
```typescript
const post = await prisma.post.create({
  data: {
    title: "My New Post",
    slug: "my-new-post",
    content: "Post content here...",
    published: true,
    publishedAt: new Date(),
    authorId: userId,
  },
});
```

**Update a post:**
```typescript
const updated = await prisma.post.update({
  where: { id: postId },
  data: { title: "Updated Title" },
});
```

**Delete a post:**
```typescript
await prisma.post.delete({
  where: { id: postId },
});
```

## Best Practices

### 1. Use the Singleton Pattern
Always import from `@/lib/prisma` instead of creating new PrismaClient instances. This prevents connection pool exhaustion in development.

❌ Don't do this:
```typescript
import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient(); // Creates new instance every time
```

✅ Do this:
```typescript
import { prisma } from "@/lib/prisma"; // Uses singleton
```

### 2. Always Use Transactions for Multiple Operations
```typescript
await prisma.$transaction([
  prisma.post.delete({ where: { id: postId } }),
  prisma.user.update({ where: { id: userId }, data: { postsCount: { decrement: 1 } } }),
]);
```

### 3. Handle Errors Properly
```typescript
try {
  const post = await prisma.post.findUniqueOrThrow({
    where: { slug: slug },
  });
} catch (error) {
  if (error.code === 'P2025') {
    // Record not found
  }
}
```

### 4. Use Indexes for Common Queries
Already configured in schema:
- `slug` - for finding posts by URL
- `published` - for filtering published posts
- `authorId` - for author-related queries

### 5. Password Hashing
**Important:** The seed file uses plain text passwords for demo purposes only. In production, always hash passwords:

```typescript
import bcrypt from "bcrypt";

const hashedPassword = await bcrypt.hash(password, 10);
const user = await prisma.user.create({
  data: {
    email: email,
    password: hashedPassword,
  },
});
```

## Prisma Studio

Prisma Studio is a visual database browser:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all your data
- Edit records
- Run queries
- Manage relationships

## Prisma Accelerate

This project includes `@prisma/extension-accelerate` for:
- Global caching
- Connection pooling
- Edge function support

To use Prisma Accelerate:
1. Sign up at [Prisma Data Platform](https://console.prisma.io)
2. Get your Accelerate connection string
3. Update `DATABASE_URL` in `.env`
4. Keep `DIRECT_URL` pointing to your actual database

## Troubleshooting

### "Environment variable not found: DATABASE_URL"
- Ensure `.env` file exists in project root
- Verify `DATABASE_URL` is set
- Restart your development server

### Migration issues
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Generate client after schema changes
npm run db:generate
```

### Connection errors
- Verify database credentials
- Check if PostgreSQL is running
- Ensure database exists
- Check firewall/network settings

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Next.js + Prisma Guide](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)
