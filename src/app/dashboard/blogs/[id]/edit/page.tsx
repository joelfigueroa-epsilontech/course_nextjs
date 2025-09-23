import { BlogForm } from '@/components/blog-form';
import { getBlogBySlugForEdit } from '@/lib/actions/blog-actions';
import { notFound } from 'next/navigation';

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic';

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id: slug } = await params;

  try {
    const blog = await getBlogBySlugForEdit(slug);

    if (!blog) {
      notFound();
    }

    return <BlogForm blog={blog} mode="edit" />;
  } catch {
    notFound();
  }
}
