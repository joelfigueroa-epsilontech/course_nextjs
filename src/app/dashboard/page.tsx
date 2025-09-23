import { BlogCard } from '@/components/blog-card';
import Link from 'next/link';

// Mock blog data for visualization
const mockBlogs = [
  {
    id: '1',
    title: 'Getting Started with Next.js 14',
    excerpt:
      'Learn how to build modern web applications with the latest features in Next.js 14, including Server Components and improved routing.',
    author: 'John Doe',
    publishedAt: '2024-01-15',
    readTime: '5 min read',
    category: 'Development',
    image: '/images/hero-background.png',
  },
  {
    id: '2',
    title: 'Mastering Supabase Authentication',
    excerpt: 'A comprehensive guide to implementing secure authentication flows with Supabase, covering SSR and client-side patterns.',
    author: 'Jane Smith',
    publishedAt: '2024-01-12',
    readTime: '8 min read',
    category: 'Backend',
    image: '/images/hero-background.png',
  },
  {
    id: '3',
    title: 'Building Beautiful UIs with Shadcn/ui',
    excerpt: 'Discover how to create stunning, accessible user interfaces using Shadcn/ui components and best practices.',
    author: 'Alex Johnson',
    publishedAt: '2024-01-10',
    readTime: '6 min read',
    category: 'Design',
    image: '/images/hero-background.png',
  },
  {
    id: '4',
    title: 'TypeScript Best Practices for 2024',
    excerpt: 'Level up your TypeScript skills with modern patterns, advanced types, and performance optimization techniques.',
    author: 'Sarah Wilson',
    publishedAt: '2024-01-08',
    readTime: '10 min read',
    category: 'Development',
    image: '/images/hero-background.png',
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here&apos;s an overview of your latest content.</p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Blog Posts</h2>
          <Link href="/dashboard/blogs" className="text-primary hover:text-primary/80 transition-colors font-medium">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>
    </div>
  );
}
