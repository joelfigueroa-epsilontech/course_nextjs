import { BlogCard } from '@/components/blog-card';
import { FeaturedBlogCard } from '@/components/featured-blog-card';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { getBlogs } from '@/lib/actions/blog-actions';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function BlogsPage() {
  // Get first 7 blogs (1 featured + 6 in grid)
  const { blogs } = await getBlogs(1, 7);

  const featuredBlog = blogs[0];
  const gridBlogs = blogs.slice(1, 7);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary to-background">
      {/* Header */}
      <Header />

      {/* Hero Section with Featured Blog */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">Untitled Design & Photography Journal</h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              The Untitled UI Journal features carefully selected good works from studios, designers, architects, photographers, and
              creators from all around the globe. Subscribe for new posts in your inbox.
            </p>
          </div>

          {/* Featured Blog */}
          {featuredBlog && (
            <div className="mb-16">
              <FeaturedBlogCard blog={featuredBlog} />
            </div>
          )}
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground">Featured blog posts</h2>
            <Link href="/blogs/all">
              <Button
                variant="outline"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/30"
              >
                View all posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Blog Grid */}
          {gridBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} showActions={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-primary-foreground/60 text-lg">No blog posts found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-card/5 backdrop-blur-sm border border-border rounded-2xl p-8 sm:p-12">
            <h3 className="text-3xl font-bold text-primary-foreground mb-4">Let&apos;s get started on something great</h3>
            <p className="text-primary-foreground/80 text-lg mb-6">Join over 4,000+ startups already growing with Untitled.</p>
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
