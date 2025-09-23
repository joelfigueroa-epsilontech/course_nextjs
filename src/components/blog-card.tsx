import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CalendarDays, Clock, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  image: string;
}

interface BlogCardProps {
  blog: BlogPost;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          <Image src={blog.image} alt={blog.title} fill className="object-cover transition-transform duration-200 group-hover:scale-105" />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {blog.category}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
          <Link href={`/dashboard/blogs/${blog.id}`} className="line-clamp-2">
            {blog.title}
          </Link>
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{blog.excerpt}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{blog.readTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            <time dateTime={blog.publishedAt}>
              {new Date(blog.publishedAt).toLocaleDateString('en-US', {
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
