import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { getBlogBySlug } from '@/lib/actions/blog-actions';
import { ArrowLeft, Clock, Network } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

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

  // Generate table of contents from blog content
  const generateTableOfContents = (content: string) => {
    if (!content) return [];

    // Extract headings from HTML content
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
    const headings: Array<{ level: number; text: string; id: string }> = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/<[^>]*>/g, '').trim(); // Remove HTML tags
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      headings.push({ level, text, id });
    }

    return headings;
  };

  const tableOfContents = generateTableOfContents(blog.content);

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Header */}
      <Header />

      {/* Hero Section with Large Image */}
      <section className="pt-16">
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
          {blog.image ? (
            <Image src={blog.image} alt={blog.title} fill className="object-cover" priority />
          ) : (
            <div className={`w-full h-full ${categoryInfo.color} flex items-center justify-center`}>
              <Network className="h-24 w-24 text-white/90" />
            </div>
          )}

          {/* Title Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-end">
            <div className="max-w-7xl mx-auto px-6 pb-12 w-full">
              <div className="max-w-4xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">{blog.title}</h1>
                {blog.subtitle && <p className="text-xl text-white/90 font-medium max-w-3xl">{blog.subtitle}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-12">
            {/* Table of Contents Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-lg border p-6">
                <h3 className="font-semibold text-foreground mb-4 pb-2 border-b">Contents</h3>
                {tableOfContents.length > 0 ? (
                  <nav className="space-y-1">
                    {tableOfContents.map((heading, index) => (
                      <a
                        key={index}
                        href={`#${heading.id}`}
                        className={`block text-sm text-muted-foreground hover:text-foreground transition-colors py-1 ${
                          heading.level === 1 ? 'font-medium' : heading.level === 2 ? 'ml-2' : 'ml-4'
                        }`}
                      >
                        {heading.level === 1 ? '→' : heading.level === 2 ? '→' : '→'} {heading.text}
                      </a>
                    ))}
                  </nav>
                ) : (
                  <p className="text-sm text-muted-foreground">No headings found in this article.</p>
                )}

                {/* Author Info */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {getInitials(blog.author)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{blog.author}</p>
                      <time className="text-xs text-muted-foreground" dateTime={blog.created_at}>
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock className="h-3 w-3" />
                    <span>{readTime} min read</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Article Content */}
            <main className="flex-1 min-w-0">
              <article className="max-w-4xl">
                {/* Mobile Author Info */}
                <div className="lg:hidden mb-8 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                        {getInitials(blog.author)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{blog.author}</p>
                        <time className="text-xs text-muted-foreground" dateTime={blog.created_at}>
                          {new Date(blog.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="h-3 w-3" />
                      <span>{readTime} min read</span>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-blockquote:text-foreground prose-li:text-foreground prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: blog.content.replace(/<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/gi, (match, level, attrs, text) => {
                        const id = text
                          .replace(/<[^>]*>/g, '')
                          .trim()
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-|-$/g, '');
                        return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
                      }),
                    }}
                  />
                </div>

                {/* Back to Blogs Button */}
                <div className="mt-12 pt-8 border-t">
                  <Link href="/blogs">
                    <Button variant="outline" className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back to all articles
                    </Button>
                  </Link>
                </div>
              </article>
            </main>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-2xl font-bold text-foreground mb-4">10x your growth with Untitled</h3>
          <p className="text-muted-foreground mb-8">Join over 4,000+ companies already growing with Untitled.</p>
          <Link href="/blogs">
            <Button size="lg" className="font-semibold px-8">
              Get started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
