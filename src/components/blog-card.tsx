'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/use-notifications';
import { deleteBlog } from '@/lib/actions/blog-actions';
import { type Blog } from '@/lib/database.types';
import { getUserFriendlyErrorMessage } from '@/lib/utils/notification-filters';
import { CalendarDays, Edit, MoreHorizontal, Trash2, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { blog: blogNotifications } = useNotifications();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    startTransition(async () => {
      try {
        const result = await deleteBlog(blog.id);
        if (result.success) {
          blogNotifications.deleteSuccess();
        }
      } catch (error) {
        const userMessage = getUserFriendlyErrorMessage(error, 'Failed to delete blog post');
        blogNotifications.deleteError(userMessage);
      } finally {
        setIsDeleting(false);
      }
    });
  };

  // Calculate read time based on content length (rough estimate: 200 words per minute)
  const calculateReadTime = (content: string | null | undefined) => {
    if (!content || typeof content !== 'string') {
      return '1 min read'; // Default fallback for empty or invalid content
    }

    const wordsPerMinute = 200;
    const wordCount = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute)); // Minimum 1 minute
    return `${readTime} min read`;
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          {blog.image ? (
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="bg-background/80 backdrop-blur-sm h-8 w-8 p-0" disabled={isPending}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/blogs/${blog.slug}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-base lg:text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
          <Link href={`/dashboard/blogs/${blog.slug}`} className="line-clamp-2">
            {blog.title}
          </Link>
        </h3>

        {blog.subtitle && <p className="text-muted-foreground text-xs lg:text-sm line-clamp-2 mb-4">{blog.subtitle}</p>}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="truncate">{blog.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{calculateReadTime(blog.content)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            <time dateTime={blog.created_at}>
              {new Date(blog.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
