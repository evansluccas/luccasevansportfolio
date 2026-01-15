import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string;
  category: string;
  tags: string;
  status: 'draft' | 'published';
  author: string;
  reading_time: number;
}

const initialFormData: BlogFormData = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  cover_image_url: '',
  category: '',
  tags: '',
  status: 'draft',
  author: 'Luccas Evans',
  reading_time: 5,
};

export default function AdminBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({ title: 'Error fetching post', description: error.message, variant: 'destructive' });
      navigate('/admin/blog');
    } else if (data) {
      setFormData({
        title: data.title,
        slug: data.slug,
        content: data.content || '',
        excerpt: data.excerpt || '',
        cover_image_url: data.cover_image_url || '',
        category: data.category || '',
        tags: (data.tags || []).join(', '),
        status: data.status as 'draft' | 'published',
        author: data.author || 'Luccas Evans',
        reading_time: data.reading_time || 5,
      });
    }
    setFetching(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const postData = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      excerpt: formData.excerpt,
      cover_image_url: formData.cover_image_url || null,
      category: formData.category || null,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: formData.status,
      author: formData.author,
      reading_time: formData.reading_time,
      published_date: formData.status === 'published' ? new Date().toISOString() : null,
    };

    let error;
    if (isEditing) {
      ({ error } = await supabase.from('blog_posts').update(postData).eq('id', id));
    } else {
      ({ error } = await supabase.from('blog_posts').insert(postData));
    }

    if (error) {
      toast({ title: 'Error saving post', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Post ${isEditing ? 'updated' : 'created'} successfully` });
      navigate('/admin/blog');
    }

    setLoading(false);
  };

  if (fetching) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isEditing ? 'Edit Post' : 'New Post'}
      description={isEditing ? 'Update blog post' : 'Write a new blog post'}
      actions={
        <Button variant="ghost" onClick={() => navigate('/admin/blog')}>
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-card border border-primary/20 rounded-2xl p-6 space-y-6">
          {/* Title & Slug */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={generateSlug}
                required
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">Content (Markdown supported)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none resize-none font-mono text-sm"
            />
          </div>

          {/* Cover Image & Category */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Cover Image URL</label>
              <input
                type="url"
                name="cover_image_url"
                value={formData.cover_image_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Technology, Product, Career..."
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="product management, agile, career"
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
            />
          </div>

          {/* Meta */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Reading Time (min)</label>
              <input
                type="number"
                name="reading_time"
                value={formData.reading_time}
                onChange={handleChange}
                min={1}
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-primary/10">
            <Button type="button" variant="ghost" onClick={() => navigate('/admin/blog')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save size={18} className="mr-2" />
              {loading ? 'Saving...' : 'Save Post'}
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
