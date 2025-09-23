'use client';

import { Badge } from '@/components/ui/badge';
import { type Blog } from '@/lib/database.types';
import { Clock, Network } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface FeaturedBlogCardProps {
  blog: Blog;
}

export function FeaturedBlogCard({ blog }: FeaturedBlogCardProps) {
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
      return { name: 'Design', color: 'bg-chart-1' };
    } else if (title.includes('tech') || title.includes('development') || title.includes('code') || title.includes('programming')) {
      return { name: 'Tech', color: 'bg-chart-2' };
    } else if (title.includes('business') || title.includes('startup') || title.includes('entrepreneur')) {
      return { name: 'Business', color: 'bg-chart-3' };
    } else if (title.includes('tutorial') || title.includes('guide') || title.includes('learn')) {
      return { name: 'Tutorial', color: 'bg-chart-4' };
    } else {
      return { name: 'Article', color: 'bg-chart-5' };
    }
  };

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const categoryInfo = getCategoryInfo();
  const readTime = calculateReadTime(blog.content);

  return (
    <Link href={`/blogs/${blog.slug}`}>
      <div className="group relative overflow-hidden rounded-2xl bg-card/5 backdrop-blur-sm border border-border hover:border-border/50 transition-all duration-300 hover:scale-[1.02]">
        {/* Background Image or Color */}
        <div className="relative h-80 sm:h-96 overflow-hidden">
          {blog.image ? (
            <>
              {/* Background image */}
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </>
          ) : (
            <>
              {/* Solid color background when no image */}
              <div className={`absolute inset-0 ${categoryInfo.color}`} />
              {/* Icon when no image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Network className="h-20 w-20 text-white/90" />
              </div>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </>
          )}

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            {/* Category Badge */}
            <Badge
              variant="secondary"
              className="bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground border-0 mb-4 hover:bg-primary-foreground/30"
            >
              {categoryInfo.name}
            </Badge>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground leading-tight mb-3 group-hover:text-primary-foreground/90 transition-colors">
              {blog.title}
            </h2>

            {/* Subtitle */}
            {blog.subtitle && <p className="text-primary-foreground/90 text-lg mb-6 line-clamp-2">{blog.subtitle}</p>}

            {/* Author and Meta Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                  {getInitials(blog.author)}
                </div>

                {/* Author name and date */}
                <div className="flex flex-col">
                  <span className="text-primary-foreground font-medium">{blog.author}</span>
                  <time className="text-primary-foreground/70 text-sm" dateTime={blog.created_at}>
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              </div>

              {/* Reading time */}
              <div className="flex items-center gap-1 text-primary-foreground/80">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
