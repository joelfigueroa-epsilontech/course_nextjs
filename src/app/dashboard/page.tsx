import { BlogCard } from '@/components/blog-card';
import { type Blog } from '@/lib/database.types';
import Link from 'next/link';

// Mock blog data for visualization - matching the Blog type from database
const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 14',
    subtitle:
      'Learn how to build modern web applications with the latest features in Next.js 14, including Server Components and improved routing.',
    content:
      "Next.js 14 introduces revolutionary features that make building web applications faster and more efficient than ever before. Server Components allow you to render components on the server, reducing the JavaScript bundle size and improving performance. The new App Router provides a more intuitive file-based routing system with nested layouts and loading states. In this comprehensive guide, we'll explore how to leverage these features to build scalable applications. We'll cover everything from basic setup to advanced optimization techniques. You'll learn about streaming, Suspense boundaries, and how to implement efficient data fetching patterns. The tutorial includes practical examples and best practices that you can apply to your own projects immediately.",
    author: 'John Doe',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    slug: 'getting-started-with-nextjs-14',
    image: '/images/hero-background.png',
    user_id: 'user-1',
  },
  {
    id: '2',
    title: 'Mastering Supabase Authentication',
    subtitle: 'A comprehensive guide to implementing secure authentication flows with Supabase, covering SSR and client-side patterns.',
    content:
      "Authentication is a critical component of modern web applications, and Supabase makes it incredibly straightforward to implement. This guide covers everything from basic email/password authentication to advanced social logins and row-level security. We'll explore how to set up authentication in both client-side and server-side rendered applications. You'll learn about session management, refresh tokens, and how to handle authentication state across different routes. The tutorial includes practical examples for implementing login forms, protected routes, and user profile management. We'll also cover best practices for security, including how to properly validate user sessions and implement authorization checks. By the end of this guide, you'll have a solid understanding of how to build secure, scalable authentication systems.",
    author: 'Jane Smith',
    created_at: '2024-01-12T14:30:00Z',
    updated_at: '2024-01-12T14:30:00Z',
    slug: 'mastering-supabase-authentication',
    image: '/images/hero-background.png',
    user_id: 'user-2',
  },
  {
    id: '3',
    title: 'Building Beautiful UIs with Shadcn/ui',
    subtitle: 'Discover how to create stunning, accessible user interfaces using Shadcn/ui components and best practices.',
    content:
      "Creating beautiful and accessible user interfaces is both an art and a science. Shadcn/ui provides a comprehensive component library that combines the flexibility of Radix UI primitives with the styling power of Tailwind CSS. In this tutorial, we'll explore how to build polished interfaces that not only look great but also provide an excellent user experience. We'll cover component composition, theming, dark mode implementation, and responsive design patterns. You'll learn how to customize components to match your brand while maintaining accessibility standards. The guide includes practical examples of building common UI patterns like forms, navigation menus, and data tables. We'll also discuss animation and micro-interactions that enhance the user experience without being distracting.",
    author: 'Alex Johnson',
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-10T09:15:00Z',
    slug: 'building-beautiful-uis-with-shadcn-ui',
    image: '/images/hero-background.png',
    user_id: 'user-3',
  },
  {
    id: '4',
    title: 'TypeScript Best Practices for 2024',
    subtitle: 'Level up your TypeScript skills with modern patterns, advanced types, and performance optimization techniques.',
    content:
      "TypeScript continues to evolve, and staying up-to-date with best practices is essential for writing maintainable code. This comprehensive guide covers the latest features and patterns that every TypeScript developer should know in 2024. We'll explore advanced type system features like template literal types, conditional types, and mapped types. You'll learn how to write more expressive and type-safe code using utility types and type guards. The tutorial covers performance optimization techniques, including how to structure your types for faster compilation and better IDE support. We'll also discuss modern tooling, ESLint configurations, and how to integrate TypeScript effectively in different project types. Whether you're building libraries, applications, or working in a team environment, this guide provides practical insights that will improve your TypeScript development workflow. We'll cover everything from basic setup to advanced architectural patterns.",
    author: 'Sarah Wilson',
    created_at: '2024-01-08T16:45:00Z',
    updated_at: '2024-01-08T16:45:00Z',
    slug: 'typescript-best-practices-for-2024',
    image: '/images/hero-background.png',
    user_id: 'user-4',
  },
];

export default function DashboardPage() {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here&apos;s an overview of your latest content.</p>
      </div>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-3">
          <h2 className="text-xl lg:text-2xl font-semibold tracking-tight">Recent Blog Posts</h2>
          <Link href="/dashboard/blogs" className="text-primary hover:text-primary/80 transition-colors font-medium text-sm lg:text-base">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {mockBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>
    </div>
  );
}
