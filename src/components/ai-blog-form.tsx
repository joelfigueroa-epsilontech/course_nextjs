'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/use-notifications';
import { generateBlogWithAI } from '@/lib/actions/blog-actions';
import { getUserFriendlyErrorMessage } from '@/lib/utils/notification-filters';
import { ArrowLeft, Bot, Sparkles } from 'lucide-react';
import { useState, useTransition } from 'react';

interface AIBlogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

export function AIBlogForm({ open, onOpenChange, onBack }: AIBlogFormProps) {
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [isPending, startTransition] = useTransition();
  const { blog: blogNotifications, form } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      form.validationError('Please describe what your blog post should be about');
      return;
    }

    if (!author.trim()) {
      form.validationError('Please enter the author name');
      return;
    }

    if (description.trim().length < 10) {
      form.validationError('Blog description must be at least 10 characters long');
      return;
    }

    startTransition(async () => {
      try {
        await generateBlogWithAI({ description: description.trim(), author: author.trim() });
        // Success notification will show after redirect via NotificationHandler
      } catch (err) {
        // Handle redirect errors gracefully
        const errorMessage = err instanceof Error ? err.message : String(err);

        if (
          errorMessage.includes('NEXT_REDIRECT') ||
          errorMessage.includes('redirect') ||
          errorMessage.toLowerCase().includes('next_redirect')
        ) {
          console.log('Filtered redirect error in AI blog form:', errorMessage);
          return; // Don't show any notification for redirect errors
        }

        // For non-redirect errors, show user-friendly message
        const userFriendlyMessage = getUserFriendlyErrorMessage(err, 'Failed to generate blog post');

        blogNotifications.createError(userFriendlyMessage);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <DialogTitle>Create Blog with AI</DialogTitle>
            </div>
          </div>
          <DialogDescription>Describe what you want your blog post to be about, and AI will generate the content for you</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="author">Author Name *</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter your name as the author"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Blog Description *</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your blog post should be about. For example: 'A comprehensive guide to React hooks for beginners' or 'The benefits of sustainable living and practical tips to get started'"
              required
              disabled={isPending}
              className="w-full min-h-[120px] p-3 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md resize-y"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              The more detailed your description, the better the AI-generated content will be.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
              Back
            </Button>
            <Button type="submit" disabled={isPending || !description.trim() || !author.trim()} className="min-w-[120px]">
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Blog
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

