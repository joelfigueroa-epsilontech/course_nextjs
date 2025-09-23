import { BlogCard } from '@/components/blog-card';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

// Extended mock blog data for the blogs page
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
  {
    id: '5',
    title: 'React Server Components Deep Dive',
    excerpt: 'Understanding the fundamentals of React Server Components and how they revolutionize data fetching and performance.',
    author: 'Mike Chen',
    publishedAt: '2024-01-05',
    readTime: '12 min read',
    category: 'Development',
    image: '/images/hero-background.png',
  },
  {
    id: '6',
    title: 'Database Design Patterns with PostgreSQL',
    excerpt: 'Explore advanced database design patterns and optimization techniques for PostgreSQL in modern applications.',
    author: 'Lisa Garcia',
    publishedAt: '2024-01-03',
    readTime: '15 min read',
    category: 'Backend',
    image: '/images/hero-background.png',
  },
];

export default function BlogsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground mt-2">Manage and explore all your blog content</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
