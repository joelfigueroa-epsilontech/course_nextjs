'use client';

import { AIBlogForm } from '@/components/ai-blog-form';
import { BlogForm } from '@/components/blog-form';
import { NewBlogModal } from '@/components/new-blog-modal';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type ViewMode = 'modal' | 'scratch' | 'ai';

export default function NewBlogPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('modal');

  // Show modal on initial load
  useEffect(() => {
    setViewMode('modal');
  }, []);

  const handleCreateFromScratch = () => {
    setViewMode('scratch');
  };

  const handleCreateWithAI = () => {
    setViewMode('ai');
  };

  const handleBackToModal = () => {
    setViewMode('modal');
  };

  const handleModalClose = () => {
    router.back();
  };

  // Render based on current view mode
  if (viewMode === 'scratch') {
    return <BlogForm mode="create" />;
  }

  return (
    <>
      <NewBlogModal
        open={viewMode === 'modal'}
        onOpenChange={(open) => {
          if (!open) handleModalClose();
        }}
        onCreateFromScratch={handleCreateFromScratch}
        onCreateWithAI={handleCreateWithAI}
      />

      <AIBlogForm
        open={viewMode === 'ai'}
        onOpenChange={(open) => {
          if (!open) handleModalClose();
        }}
        onBack={handleBackToModal}
      />
    </>
  );
}
