import { BlogCard } from '@/components/blog-card';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { getBlogs } from '@/lib/actions/blog-actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AllBlogsPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function AllBlogsPage({ searchParams }: AllBlogsPageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const { blogs, totalCount, hasMore } = await getBlogs(currentPage, 12);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary to-background">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/blogs">
            <Button
              variant="ghost"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to blog home
            </Button>
          </Link>

          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">All Blog Posts</h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Explore our complete collection of articles, tutorials, and insights from our community of creators.
            </p>
            <p className="text-primary-foreground/60 mt-4">
              {totalCount} article{totalCount !== 1 ? 's' : ''} published
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Blog Grid */}
          {blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} showActions={false} />
                ))}
              </div>

              {/* Pagination */}
              {(currentPage > 1 || hasMore) && (
                <div className="flex justify-center gap-4">
                  {currentPage > 1 && (
                    <Link href={`/blogs/all?page=${currentPage - 1}`}>
                      <Button
                        variant="outline"
                        className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/30"
                      >
                        Previous
                      </Button>
                    </Link>
                  )}

                  <span className="flex items-center text-primary-foreground/80 px-4">Page {currentPage}</span>

                  {hasMore && (
                    <Link href={`/blogs/all?page=${currentPage + 1}`}>
                      <Button
                        variant="outline"
                        className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/30"
                      >
                        Next
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-primary-foreground/60 text-lg">No blog posts found.</p>
              <Link href="/blogs">
                <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold mt-6">
                  Go back to blog home
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
