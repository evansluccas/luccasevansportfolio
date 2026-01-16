import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

interface ProjectFormData {
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  cover_image_url: string;
  technologies: string;
  demo_link: string;
  repo_link: string;
  category: string;
  featured: boolean;
  published: boolean;
  results: string;
  display_order: number;
}

const initialFormData: ProjectFormData = {
  title: '',
  slug: '',
  short_description: '',
  full_description: '',
  cover_image_url: '',
  technologies: '',
  demo_link: '',
  repo_link: '',
  category: 'Web',
  featured: false,
  published: true,
  results: '',
  display_order: 0,
};

export default function AdminProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({ title: 'Error fetching project', description: error.message, variant: 'destructive' });
      navigate('/admin/projects');
    } else if (data) {
      setFormData({
        title: data.title,
        slug: data.slug,
        short_description: data.short_description,
        full_description: data.full_description || '',
        cover_image_url: data.cover_image_url || '',
        technologies: (data.technologies || []).join(', '),
        demo_link: data.demo_link || '',
        repo_link: data.repo_link || '',
        category: data.category || 'Web',
        featured: data.featured || false,
        published: data.published,
        results: (data.results || []).join('\n'),
        display_order: data.display_order,
      });
    }
    setFetching(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
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

    const projectData = {
      title: formData.title,
      slug: formData.slug,
      short_description: formData.short_description,
      full_description: formData.full_description,
      cover_image_url: formData.cover_image_url || null,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      demo_link: formData.demo_link || null,
      repo_link: formData.repo_link || null,
      category: formData.category,
      featured: formData.featured,
      published: formData.published,
      results: formData.results.split('\n').filter(Boolean),
      display_order: formData.display_order,
    };

    let error;
    if (isEditing) {
      ({ error } = await supabase.from('projects').update(projectData).eq('id', id));
    } else {
      ({ error } = await supabase.from('projects').insert(projectData));
    }

    if (error) {
      toast({ title: 'Error saving project', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Project ${isEditing ? 'updated' : 'created'} successfully` });
      navigate('/admin/projects');
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
      title={isEditing ? 'Edit Project' : 'New Project'}
      description={isEditing ? 'Update project details' : 'Add a new project to your portfolio'}
      actions={
        <Button variant="ghost" onClick={() => navigate('/admin/projects')}>
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

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Short Description *</label>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none resize-none"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Description</label>
            <RichTextEditor
              value={formData.full_description}
              onChange={(value) => setFormData(prev => ({ ...prev, full_description: value }))}
              placeholder="Write a detailed description of the project..."
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
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              >
                <option value="Web">Web</option>
                <option value="Mobile">Mobile</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
              </select>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, PostgreSQL"
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
            />
          </div>

          {/* Links */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Demo Link</label>
              <input
                type="url"
                name="demo_link"
                value={formData.demo_link}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Repository Link</label>
              <input
                type="url"
                name="repo_link"
                value={formData.repo_link}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Results */}
          <div>
            <label className="block text-sm font-medium mb-2">Key Results (one per line)</label>
            <textarea
              name="results"
              value={formData.results}
              onChange={handleChange}
              rows={3}
              placeholder="40% increase in engagement&#10;10K+ users&#10;99.9% uptime"
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none resize-none"
            />
          </div>

          {/* Order & Toggles */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Display Order</label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3 pt-8">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-muted text-primary focus:ring-primary"
              />
              <label htmlFor="featured" className="text-sm font-medium">Featured</label>
            </div>
            <div className="flex items-center gap-3 pt-8">
              <input
                type="checkbox"
                name="published"
                id="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-5 h-5 rounded border-muted text-primary focus:ring-primary"
              />
              <label htmlFor="published" className="text-sm font-medium">Published</label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-primary/10">
            <Button type="button" variant="ghost" onClick={() => navigate('/admin/projects')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save size={18} className="mr-2" />
              {loading ? 'Saving...' : 'Save Project'}
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
