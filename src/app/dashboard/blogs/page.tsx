import { BlogCard } from '@/components/blog-card';
import { Button } from '@/components/ui/button';
import { getUserBlogs } from '@/lib/actions/blog-actions';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

async function BlogsList() {
  try {
    const { blogs } = await getUserBlogs(1, 20); // Get first 20 blogs

    if (blogs.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No blogs yet</h3>
          <p className="text-muted-foreground mb-6">Start creating amazing content by writing your first blog post.</p>
          <Link href="/dashboard/blogs/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Post
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    );
  } catch {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Error loading blogs</h3>
        <p className="text-muted-foreground">There was an error loading your blog posts. Please try again.</p>
      </div>
    );
  }
}

function BlogsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-muted animate-pulse rounded-lg h-80" />
      ))}
    </div>
  );
}

export default function BlogsPage() {
  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">My Blog Posts</h1>
          <p className="text-muted-foreground mt-2">Manage and explore all your blog content</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Link href="/dashboard/blogs/new">
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<BlogsLoading />}>
        <BlogsList />
      </Suspense>
    </div>
  );
}
