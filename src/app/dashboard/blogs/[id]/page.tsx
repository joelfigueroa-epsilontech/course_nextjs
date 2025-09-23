import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, BookmarkPlus, CalendarDays, Clock, Share2, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock blog detail data - in a real app, this would be fetched based on the ID
const getBlogPost = (id: string) => {
  const blogPosts = {
    '1': {
      id: '1',
      title: 'Getting Started with Next.js 14',
      content: `
        <p>Next.js 14 introduces powerful new features that make building modern web applications faster and more intuitive than ever before. In this comprehensive guide, we'll explore the latest capabilities and learn how to leverage them effectively.</p>
        
        <h2>What's New in Next.js 14</h2>
        <p>The latest version of Next.js brings several exciting improvements including enhanced Server Components, improved caching mechanisms, and better developer experience tools.</p>
        
        <h3>Server Components Enhancement</h3>
        <p>Server Components in Next.js 14 offer better performance and simplified data fetching patterns. They allow you to run code on the server, reducing the amount of JavaScript sent to the client.</p>
        
        <h3>Improved App Router</h3>
        <p>The App Router has been refined with better error handling, improved loading states, and more intuitive file-based routing conventions.</p>
        
        <h2>Getting Started</h2>
        <p>To create a new Next.js 14 project, simply run the following command:</p>
        <pre><code>npx create-next-app@latest my-app</code></pre>
        
        <p>This will set up a new project with all the latest features and best practices configured out of the box.</p>
      `,
      excerpt:
        'Learn how to build modern web applications with the latest features in Next.js 14, including Server Components and improved routing.',
      author: 'John Doe',
      publishedAt: '2024-01-15',
      readTime: '5 min read',
      category: 'Development',
      image: '/images/hero-background.png',
    },
    // Add more mock posts as needed
  };

  return blogPosts[id as keyof typeof blogPosts] || null;
};

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;
  const blog = getBlogPost(id);

  if (!blog) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <p className="text-muted-foreground mb-6">The blog post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/dashboard/blogs">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard/blogs">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{blog.category}</Badge>
            </div>

            <h1 className="text-3xl font-bold leading-tight mb-4">{blog.title}</h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-6">{blog.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {blog.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <span className="font-medium">{blog.author}</span>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      <time dateTime={blog.publishedAt}>
                        {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{blog.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Featured Image */}
            <div className="relative aspect-video mb-8 overflow-hidden rounded-lg">
              <Image src={blog.image} alt={blog.title} fill className="object-cover" />
            </div>

            <Separator className="mb-8" />

            {/* Article Content */}
            <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
          </CardContent>
        </Card>

        {/* Article Footer */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-sm">
                    {blog.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{blog.author}</p>
                  <p className="text-sm text-muted-foreground">Content Writer & Developer</p>
                </div>
              </div>

              <Button variant="outline">
                <User className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
