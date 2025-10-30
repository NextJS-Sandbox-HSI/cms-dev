import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Hash the demo password securely
  const hashedPassword = await bcrypt.hash("Admin123!", 10);

  // Create a demo admin user with hashed password
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
    },
  });

  console.log("✅ Created user:", user.email);
  console.log("🔐 Login credentials:");
  console.log("   Email: admin@example.com");
  console.log("   Password: Admin123!");

  // Generate 100 blog posts with long content
  console.log("📝 Generating 100 blog posts...");

  const topics = [
    { category: "Web Development", tags: ["JavaScript", "React", "TypeScript", "Next.js"] },
    { category: "Backend Development", tags: ["Node.js", "Prisma", "PostgreSQL", "API Design"] },
    { category: "DevOps", tags: ["Docker", "CI/CD", "Kubernetes", "Cloud"] },
    { category: "UI/UX Design", tags: ["Tailwind CSS", "Design Systems", "Accessibility", "Animation"] },
    { category: "Programming", tags: ["Python", "Go", "Rust", "Best Practices"] },
    { category: "Testing", tags: ["Jest", "Testing Library", "E2E", "Unit Tests"] },
    { category: "Performance", tags: ["Optimization", "Caching", "Monitoring", "Profiling"] },
  ];

  const postTemplates = [
    (title: string, topic: string) => `# ${title}

In this comprehensive guide, we'll explore the fascinating world of ${topic}. Whether you're a beginner or an experienced developer, this article will provide valuable insights and practical knowledge that you can apply immediately to your projects.

## Introduction

${topic} has become increasingly important in modern software development. As applications grow more complex and user expectations continue to rise, understanding the fundamentals and advanced concepts of ${topic} is essential for any developer looking to stay competitive in today's tech landscape.

## Understanding the Basics

Before diving into advanced techniques, it's crucial to establish a solid foundation. ${topic} represents a paradigm shift in how we approach problem-solving in software development. The core principles revolve around efficiency, maintainability, and scalability.

### Core Concepts

The fundamental concepts of ${topic} include several key principles that every developer should understand. First, we need to consider the architectural implications of our choices. The decisions we make early in the development process can have far-reaching consequences for the entire application lifecycle.

Second, performance considerations cannot be overlooked. Modern users expect applications to be fast and responsive, regardless of their device or network conditions. This means we must optimize our code at every level, from database queries to frontend rendering.

Third, security must be built into the system from the ground up. With cyber threats constantly evolving, we cannot afford to treat security as an afterthought. Every line of code we write should be scrutinized for potential vulnerabilities.

## Advanced Techniques

Once you've mastered the basics, it's time to explore more advanced techniques that can take your skills to the next level. These techniques are used by senior developers and tech leads at major companies around the world.

### Pattern Recognition

Understanding common patterns in ${topic} allows you to quickly identify solutions to recurring problems. Design patterns provide a shared vocabulary for discussing software architecture and can significantly improve code quality and team communication.

### Performance Optimization

Performance optimization is both an art and a science. It requires a deep understanding of how computers work at a fundamental level, combined with practical knowledge of profiling tools and optimization techniques. The key is to measure first, optimize second, and never assume you know where the bottlenecks are.

### Scalability Considerations

As your application grows, scalability becomes increasingly important. This means thinking about horizontal scaling, load balancing, caching strategies, and database optimization. Every architectural decision should be made with future growth in mind.

## Best Practices

Following best practices is essential for writing maintainable, efficient code. Here are some key principles to keep in mind:

1. **Write Clean Code**: Code should be self-documenting and easy to understand. Use meaningful variable names, keep functions small and focused, and follow consistent formatting conventions.

2. **Test Thoroughly**: Comprehensive testing catches bugs early and gives you confidence when refactoring. Aim for high test coverage, but focus on testing behavior rather than implementation details.

3. **Document Everything**: Good documentation saves time and reduces frustration for future developers (including your future self). Document not just what the code does, but why it does it.

4. **Embrace Code Reviews**: Code reviews are one of the most effective ways to improve code quality and share knowledge within a team. Approach reviews with a collaborative mindset.

5. **Continuous Learning**: Technology evolves rapidly. Stay current by reading blogs, attending conferences, and experimenting with new tools and techniques.

## Real-World Applications

Let's look at some real-world scenarios where these concepts come into play. Understanding theory is important, but seeing how it applies in practice is what truly solidifies your knowledge.

### Case Study: Building Scalable APIs

When building APIs that need to handle thousands of requests per second, every optimization matters. We need to consider caching strategies, database indexing, connection pooling, and horizontal scaling. The architecture must be designed to handle both normal load and unexpected traffic spikes.

### Case Study: Frontend Performance

Modern web applications need to load quickly and respond instantly to user interactions. This requires careful attention to bundle sizes, code splitting, lazy loading, and efficient rendering strategies. Tools like Lighthouse can help identify performance bottlenecks.

## Common Pitfalls and How to Avoid Them

Even experienced developers make mistakes. Here are some common pitfalls and strategies for avoiding them:

- **Premature Optimization**: Don't optimize code before you know it's a bottleneck. Measure first, then optimize.
- **Over-Engineering**: Keep solutions as simple as possible. Complexity is the enemy of maintainability.
- **Ignoring Edge Cases**: Always consider what happens when things go wrong. Error handling is not optional.
- **Poor Communication**: Technical problems are often communication problems in disguise. Invest time in clear documentation and team communication.

## Tools and Resources

The right tools can significantly improve your productivity and code quality. Here are some essential tools for working with ${topic}:

- **Development Environment**: Choose an IDE or editor that supports your workflow
- **Version Control**: Git is essential for collaboration and code history
- **Testing Frameworks**: Automated testing saves time and catches regressions
- **Monitoring Tools**: Know what's happening in production
- **Documentation Platforms**: Keep your docs up to date and accessible

## Conclusion

Mastering ${topic} is a journey, not a destination. The field is constantly evolving, with new techniques, tools, and best practices emerging regularly. The key is to maintain a growth mindset, stay curious, and never stop learning.

Remember that becoming proficient takes time and practice. Don't get discouraged if concepts don't click immediately. Keep experimenting, building projects, and learning from both successes and failures.

## Next Steps

To continue your learning journey:

1. Build a project that incorporates these concepts
2. Contribute to open-source projects
3. Join developer communities and forums
4. Read the official documentation thoroughly
5. Experiment with different approaches and patterns

The best way to learn is by doing. Start small, iterate quickly, and gradually increase complexity as your confidence grows.

## Additional Resources

For those who want to dive deeper, here are some recommended resources:

- Official documentation and guides
- Online courses and tutorials
- Books by industry experts
- Conference talks and podcasts
- Community forums and discussion boards

Thank you for reading! If you found this article helpful, please share it with others who might benefit from it.`,

    (title: string, topic: string) => `# ${title}

Welcome to this in-depth exploration of ${topic}. In this article, we'll cover everything you need to know to become proficient with this essential technology.

## Why ${topic} Matters

The landscape of software development is constantly evolving, and ${topic} has emerged as a crucial skill for modern developers. Understanding why this technology matters is the first step toward mastering it.

### Industry Adoption

Major tech companies have widely adopted ${topic} in their production systems. This widespread adoption is not accidental—it's a testament to the real-world benefits and practical advantages that ${topic} provides.

### Developer Experience

One of the key factors driving the popularity of ${topic} is the improved developer experience it offers. Developers can write more expressive code, debug issues more easily, and iterate faster on new features.

### Performance Benefits

Beyond developer experience, ${topic} offers tangible performance improvements. Applications built with these techniques tend to be faster, more responsive, and more efficient in their use of system resources.

## Getting Started

Let's begin with the fundamentals. Understanding the basics is essential before moving on to more advanced concepts.

### Setting Up Your Environment

The first step is setting up a proper development environment. This includes installing necessary tools, configuring your IDE, and understanding the development workflow.

A well-configured development environment can dramatically improve your productivity. Take the time to set things up properly from the start, and you'll reap the benefits throughout your project.

### Your First Implementation

Starting with a simple example is the best way to build confidence. We'll create a basic implementation that demonstrates core concepts while keeping complexity manageable.

This hands-on approach ensures that you understand not just the theory, but also the practical aspects of working with ${topic}.

## Core Principles

Several fundamental principles underpin ${topic}. These principles guide decision-making and help developers write better code.

### Principle 1: Simplicity

Simplicity should be your guiding light. Simple code is easier to understand, maintain, and debug. While it's tempting to use complex patterns or clever tricks, simple solutions are almost always better.

### Principle 2: Composability

Well-designed systems are composed of small, reusable pieces. Each component should have a single, well-defined responsibility. This modularity makes code easier to test and reuse.

### Principle 3: Performance

Performance matters, but premature optimization is dangerous. Focus first on writing correct, maintainable code. Then, if performance issues arise, profile your application to identify actual bottlenecks.

### Principle 4: Security

Security must be built in from the start. Consider potential vulnerabilities at every level of your application, from input validation to authentication and authorization.

## Advanced Concepts

Now that we've covered the basics, let's explore more advanced concepts that will elevate your skills to the next level.

### Deep Dive into Architecture

Architecture decisions have long-lasting impacts on your project. A well-architected system is flexible, maintainable, and scalable. Poor architecture leads to technical debt and maintenance nightmares.

### Optimization Strategies

Once your application is working correctly, you can focus on optimization. The key is to measure everything. Use profiling tools to identify bottlenecks, then optimize those specific areas.

Remember the 80/20 rule: 80% of the performance impact typically comes from 20% of the code. Focus your optimization efforts where they'll have the most impact.

### Testing and Quality Assurance

Comprehensive testing is not optional in professional software development. Tests serve as documentation, catch regressions, and give you confidence when refactoring.

Different types of tests serve different purposes. Unit tests verify individual components, integration tests ensure components work together correctly, and end-to-end tests validate entire user flows.

## Practical Examples

Theory is important, but practical examples bring concepts to life. Let's look at some real-world scenarios.

### Example 1: Building a Feature

When building a new feature, start by understanding the requirements thoroughly. Design the solution, considering edge cases and potential issues. Implement the feature incrementally, testing as you go.

### Example 2: Debugging Issues

Debugging is a critical skill. When issues arise, approach them systematically. Reproduce the problem, isolate the cause, fix the issue, and add tests to prevent regression.

### Example 3: Performance Tuning

Performance tuning requires a methodical approach. Measure baseline performance, identify bottlenecks, implement optimizations, and verify improvements. Never assume—always measure.

## Best Practices and Patterns

Following established best practices helps you avoid common pitfalls and write better code.

### Code Organization

Organize your code logically. Use consistent file structures, naming conventions, and module boundaries. Good organization makes codebases easier to navigate and understand.

### Error Handling

Robust error handling is essential for production applications. Anticipate what can go wrong, handle errors gracefully, and provide useful error messages.

### Documentation

Documentation is often overlooked but critically important. Document not just what your code does, but why it does it. Future you (and your teammates) will be grateful.

## Common Mistakes

Learning from mistakes—both your own and others'—accelerates your growth as a developer.

### Mistake 1: Not Reading Documentation

The official documentation is your friend. Many problems can be solved by carefully reading the docs. Don't skip this step.

### Mistake 2: Copy-Pasting Without Understanding

It's tempting to copy code from Stack Overflow, but understanding what the code does is essential. Take time to understand before implementing.

### Mistake 3: Ignoring Warnings

Warnings exist for a reason. Don't ignore them. They often indicate potential issues that will cause problems later.

## Tools and Ecosystem

The ecosystem around ${topic} includes many useful tools that can improve your workflow.

### Development Tools

Modern development tools can significantly boost your productivity. IDEs provide intelligent code completion, refactoring tools, and integrated debugging.

### Build Tools

Build tools automate repetitive tasks, optimize code, and manage dependencies. Learning to use these tools effectively is a valuable skill.

### Monitoring and Analytics

Production monitoring helps you understand how your application performs in the real world. Analytics provide insights into user behavior and application health.

## Future Trends

The technology landscape never stands still. Staying informed about trends helps you make better long-term decisions.

### Emerging Technologies

New technologies and techniques are constantly emerging. While you don't need to learn everything, staying aware of trends helps you make informed choices about which technologies to invest time in learning.

### Community and Ecosystem Growth

Strong communities drive technology forward. Engage with the community through forums, conferences, and open-source contributions.

## Conclusion

We've covered a lot of ground in this article. ${topic} is a rich subject with many facets to explore. The journey from beginner to expert is gradual, requiring consistent practice and continuous learning.

Remember that everyone was a beginner once. Don't be intimidated by what you don't know. Focus on steady progress, celebrate small wins, and keep building.

## Take Action

Knowledge without action is just trivia. To truly master ${topic}:

1. Start a practice project today
2. Join developer communities
3. Read the official documentation
4. Experiment with different approaches
5. Share your learnings with others

Thank you for reading! Keep coding, keep learning, and keep building amazing things.`,
  ];

  const posts = [];
  for (let i = 1; i <= 100; i++) {
    const topic = topics[i % topics.length];
    const templateIndex = i % postTemplates.length;
    const shouldPublish = i <= 85; // 85% published, 15% drafts

    const title = `${topic.category} Deep Dive: Advanced Concepts and Best Practices ${i}`;
    const slug = `${topic.category.toLowerCase().replace(/\s+/g, "-")}-deep-dive-${i}`;
    const tag = topic.tags[i % topic.tags.length];

    const content = postTemplates[templateIndex](title, `${tag} in ${topic.category}`);
    const excerpt = `A comprehensive guide to ${tag} in ${topic.category}. Learn advanced concepts, best practices, and real-world applications. Perfect for developers looking to level up their skills.`;

    // Vary the publish dates over the last 90 days
    const daysAgo = Math.floor(i / 1.2);
    const publishDate = new Date();
    publishDate.setDate(publishDate.getDate() - daysAgo);

    posts.push(
      prisma.post.create({
        data: {
          title,
          slug,
          content,
          excerpt,
          published: shouldPublish,
          publishedAt: shouldPublish ? publishDate : null,
          authorId: user.id,
        },
      })
    );

    // Process in batches to avoid overwhelming the database
    if (i % 10 === 0) {
      await Promise.all(posts.splice(0, 10));
      console.log(`   Created ${i}/100 posts...`);
    }
  }

  // Create any remaining posts
  if (posts.length > 0) {
    await Promise.all(posts);
  }

  console.log(`✅ Created 100 blog posts (85 published, 15 drafts)`);
  console.log("🎉 Database seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
