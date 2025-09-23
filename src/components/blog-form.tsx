'use client';

import { TipTapEditor } from '@/components/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/use-notifications';
import { createBlog, updateBlog } from '@/lib/actions/blog-actions';
import { type Blog, type BlogFormData } from '@/lib/database.types';
import { getUserFriendlyErrorMessage } from '@/lib/utils/notification-filters';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface BlogFormProps {
  blog?: Blog;
  mode: 'create' | 'edit';
}

export function BlogForm({ blog, mode }: BlogFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { blog: blogNotifications, form } = useNotifications();

  const [formData, setFormData] = useState<BlogFormData>({
    title: blog?.title || '',
    subtitle: blog?.subtitle || '',
    image: blog?.image || '',
    content: blog?.content || '',
    author: blog?.author || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      blogNotifications.requiredFields();
      return;
    }

    // Enhanced validation
    if (formData.title.trim().length < 3) {
      form.validationError('Title must be at least 3 characters long');
      return;
    }

    if (formData.content.trim().length < 10) {
      form.validationError('Content must be at least 10 characters long');
      return;
    }

    if (formData.image && !formData.image.match(/^https?:\/\/.+/)) {
      form.invalidFormat('image URL');
      return;
    }

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createBlog(formData);
          // Success notification will show after redirect via NotificationHandler
        } else if (blog) {
          await updateBlog(blog.id, formData);
          // Success notification will show after redirect via NotificationHandler
        } else {
          setError('No blog data available for update');
        }
      } catch (err) {
        // Extra aggressive filtering for redirect errors in blog operations
        const errorMessage = err instanceof Error ? err.message : String(err);

        // Check if this is a redirect error and ignore it completely
        if (
          errorMessage.includes('NEXT_REDIRECT') ||
          errorMessage.includes('redirect') ||
          errorMessage.toLowerCase().includes('next_redirect')
        ) {
          console.log('Filtered redirect error in blog form:', errorMessage);
          return; // Don't show any notification for redirect errors
        }

        // For non-redirect errors, use robust error message handling
        const userFriendlyMessage = getUserFriendlyErrorMessage(
          err,
          mode === 'create' ? 'Failed to create blog post' : 'Failed to update blog post'
        );

        if (mode === 'create') {
          blogNotifications.createError(userFriendlyMessage);
        } else {
          blogNotifications.updateError(userFriendlyMessage);
        }
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div>
          <h1 className="text-3xl font-bold">{mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}</h1>
          <p className="text-muted-foreground mt-2">
            {mode === 'create' ? 'Write and publish your new blog post' : 'Update your blog post'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Blog Details</CardTitle>
            <CardDescription>Basic information about your blog post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter blog title"
                required
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Enter blog subtitle (optional)"
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="Enter author name"
                required
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Cover Image URL</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.image}
                    alt="Cover preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content *</CardTitle>
            <CardDescription>Write your blog post content using the rich text editor</CardDescription>
          </CardHeader>
          <CardContent>
            <TipTapEditor
              content={formData.content}
              onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
              placeholder="Start writing your blog post..."
              className="min-h-[400px]"
            />
          </CardContent>
        </Card>

        {error && <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">{error}</div>}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleBack} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {mode === 'create' ? 'Publish' : 'Update'}
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
