'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bot, PenTool } from 'lucide-react';

interface NewBlogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFromScratch: () => void;
  onCreateWithAI: () => void;
}

export function NewBlogModal({ open, onOpenChange, onCreateFromScratch, onCreateWithAI }: NewBlogModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
          <DialogDescription>Choose how you'd like to create your new blog post</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Button variant="outline" className="flex items-center gap-3 h-auto p-4 text-left" onClick={onCreateFromScratch}>
            <div className="p-2 bg-primary/10 rounded-lg">
              <PenTool className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Create from scratch</div>
              <div className="text-sm text-muted-foreground">Start with a blank canvas and write your own content</div>
            </div>
          </Button>

          <Button variant="outline" className="flex items-center gap-3 h-auto p-4 text-left" onClick={onCreateWithAI}>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Bot className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Create with AI</div>
              <div className="text-sm text-muted-foreground">Let AI help you generate content based on your idea</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

