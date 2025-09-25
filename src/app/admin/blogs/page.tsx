import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Blog } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/server';
import { CalendarDays, Edit, ExternalLink, Eye, FileText, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface BlogStats {
  totalBlogs: number;
  publishedToday: number;
  averageLength: number;
}

async function getBlogsData(): Promise<{ blogs: Blog[]; stats: BlogStats }> {
  const supabase = await createClient();

  try {
    // Get all blogs with detailed information
    const { data: blogs } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });

    if (!blogs) {
      return {
        blogs: [],
        stats: { totalBlogs: 0, publishedToday: 0, averageLength: 0 },
      };
    }

    // Calculate statistics
    const today = new Date().toISOString().split('T')[0];
    const publishedToday = blogs.filter((blog) => blog.created_at.startsWith(today)).length;

    const averageLength =
      blogs.length > 0 ? Math.round(blogs.reduce((sum, blog) => sum + (blog.content?.length || 0), 0) / blogs.length) : 0;

    const stats: BlogStats = {
      totalBlogs: blogs.length,
      publishedToday,
      averageLength,
    };

    return { blogs, stats };
  } catch (error) {
    console.error('Error fetching blogs data:', error);
    return {
      blogs: [],
      stats: { totalBlogs: 0, publishedToday: 0, averageLength: 0 },
    };
  }
}

function getStatusBadge(_blog: Blog) {
  // In a real app, you might have a status field
  // For now, we'll consider all blogs as published
  return (
    <Badge variant="secondary" className="text-green-700 bg-green-100">
      Published
    </Badge>
  );
}

function formatContentLength(length: number): string {
  if (length < 1000) return `${length} chars`;
  if (length < 10000) return `${(length / 1000).toFixed(1)}k chars`;
  return `${Math.round(length / 1000)}k chars`;
}

export default async function AdminBlogsPage() {
  const { blogs, stats } = await getBlogsData();

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor all blog posts in your application</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Search className="w-4 h-4 mr-2" />
            Search Blogs
          </Button>
          <Button size="sm" className="w-full sm:w-auto">
            <FileText className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Blog Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogs}</div>
            <p className="text-xs text-muted-foreground">Published blog posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Today</CardTitle>
            <CalendarDays className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedToday}</div>
            <p className="text-xs text-muted-foreground">New posts today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Length</CardTitle>
            <Eye className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatContentLength(stats.averageLength)}</div>
            <p className="text-xs text-muted-foreground">Average content length</p>
          </CardContent>
        </Card>
      </div>

      {/* Blogs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>A comprehensive list of all blog posts in your application.</CardDescription>
        </CardHeader>
        <CardContent>
          {blogs.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title & Author</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>
                        <div className="space-y-1 max-w-sm">
                          <div className="font-medium truncate" title={blog.title}>
                            {blog.title}
                          </div>
                          {blog.subtitle && (
                            <div className="text-sm text-muted-foreground truncate" title={blog.subtitle}>
                              {blog.subtitle}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src="" />
                              <AvatarFallback className="text-xs">
                                {blog.author
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{blog.author}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {formatContentLength(blog.content?.length || 0)}
                          </Badge>
                          {blog.slug && (
                            <div className="text-xs text-muted-foreground font-mono truncate max-w-32" title={blog.slug}>
                              /{blog.slug}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">{new Date(blog.created_at).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">{new Date(blog.created_at).toLocaleTimeString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">{new Date(blog.updated_at).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">{new Date(blog.updated_at).toLocaleTimeString()}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(blog)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/blogs/${blog.slug}`} target="_blank">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <ExternalLink className="h-3 w-3" />
                              <span className="sr-only">View blog</span>
                            </Button>
                          </Link>
                          <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Edit className="h-3 w-3" />
                              <span className="sr-only">Edit blog</span>
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Delete blog</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No blog posts found</h3>
              <p className="text-muted-foreground">Blog posts will appear here once users start creating content.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
