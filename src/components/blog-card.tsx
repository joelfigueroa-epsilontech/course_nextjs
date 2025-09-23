'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/use-notifications';
import { deleteBlog } from '@/lib/actions/blog-actions';
import { type Blog } from '@/lib/database.types';
import { getUserFriendlyErrorMessage } from '@/lib/utils/notification-filters';
import { Clock, Edit, MoreHorizontal, Network, Trash2 } from 'lucide-react';
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
      return '1'; // Default fallback for empty or invalid content
    }

    const wordsPerMinute = 200;
    const wordCount = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute)); // Minimum 1 minute
    return readTime.toString();
  };

  // Get category and color based on content or title (simple categorization)
  const getCategoryInfo = () => {
    const title = blog.title.toLowerCase();
    const content = blog.content?.toLowerCase() || '';

    if (title.includes('design') || content.includes('design') || title.includes('ui') || title.includes('ux')) {
      return { name: 'Design', color: 'bg-orange-500' };
    } else if (title.includes('tech') || title.includes('development') || title.includes('code') || title.includes('programming')) {
      return { name: 'Tech', color: 'bg-blue-500' };
    } else if (title.includes('business') || title.includes('startup') || title.includes('entrepreneur')) {
      return { name: 'Business', color: 'bg-green-500' };
    } else if (title.includes('tutorial') || title.includes('guide') || title.includes('learn')) {
      return { name: 'Tutorial', color: 'bg-purple-500' };
    } else {
      return { name: 'Article', color: 'bg-slate-500' };
    }
  };

  const categoryInfo = getCategoryInfo();
  const readTime = calculateReadTime(blog.content);

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-0 shadow-sm">
      {/* Header with image or colored background */}
      <CardHeader className="p-0">
        <div className="relative h-32 overflow-hidden">
          {blog.image ? (
            <>
              {/* Background image */}
              <Image src={blog.image} alt={blog.title} fill className="object-cover" />
              {/* Light colored overlay */}
              <div className={`absolute inset-0 ${categoryInfo.color} opacity-20`} />
            </>
          ) : (
            <>
              {/* Solid color background when no image */}
              <div className={`absolute inset-0 ${categoryInfo.color}`} />
              {/* Icon only when no image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Network className="h-12 w-12 text-white/90" />
              </div>
            </>
          )}

          {/* Actions dropdown */}
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm h-8 w-8 p-0 border-0 hover:bg-white/30"
                  disabled={isPending}
                >
                  <MoreHorizontal className="h-4 w-4 text-white" />
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

          {/* Category badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/80 text-white text-xs px-2 py-1 rounded">{categoryInfo.name}</span>
          </div>

          {/* Reading time */}
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-1 text-white/90 text-xs">
              <Clock className="h-3 w-3" />
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
          <Link href={`/dashboard/blogs/${blog.slug}`} className="line-clamp-2">
            {blog.title}
          </Link>
        </h3>

        {/* Description/Subtitle */}
        {blog.subtitle && <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{blog.subtitle}</p>}

        {/* Author info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {getInitials(blog.author)}
          </div>

          {/* Author name and date */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{blog.author}</span>
            <time className="text-xs text-muted-foreground" dateTime={blog.created_at}>
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
