import { BlogCard } from '@/components/blog-card';
import { getUserBlogs } from '@/lib/actions/blog-actions';
import { type Blog } from '@/lib/database.types';
import Link from 'next/link';

export default async function DashboardPage() {
  let blogs: Blog[] = [];
  let hasError = false;

  try {
    // Fetch the user's recent blog posts (limit to 8 for dashboard view)
    const result = await getUserBlogs(1, 8);
    blogs = result.blogs;
  } catch (error) {
    console.error('Failed to fetch user blogs:', error);
    hasError = true;
  }

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
          {hasError ? (
            <div className="col-span-full text-center py-12">
              <p className="text-destructive mb-4">Failed to load your blog posts. Please try refreshing the page.</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Refresh
              </Link>
            </div>
          ) : blogs.length > 0 ? (
            blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">You haven&apos;t created any blog posts yet.</p>
              <Link
                href="/dashboard/blogs/new"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Create Your First Blog Post
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
