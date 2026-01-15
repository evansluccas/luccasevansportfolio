import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  featured: boolean;
  published: boolean;
  created_at: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({ title: 'Error fetching projects', description: error.message, variant: 'destructive' });
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error deleting project', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Project deleted successfully' });
      fetchProjects();
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('projects')
      .update({ published: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error updating project', description: error.message, variant: 'destructive' });
    } else {
      fetchProjects();
    }
  };

  return (
    <AdminLayout
      title="Projects"
      description="Manage your portfolio projects"
      actions={
        <Button asChild>
          <Link to="/admin/projects/new">
            <Plus size={18} className="mr-2" />
            Add Project
          </Link>
        </Button>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-card border border-primary/20 rounded-2xl">
          <FolderKanban size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">Start by adding your first project</p>
          <Button asChild>
            <Link to="/admin/projects/new">
              <Plus size={18} className="mr-2" />
              Add Project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="bg-card border border-primary/20 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Title</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-foreground">{project.title}</div>
                      <div className="text-sm text-muted-foreground">/{project.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublished(project.id, project.published)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        project.published
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {project.published ? <Eye size={14} /> : <EyeOff size={14} />}
                      {project.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/projects/${project.id}`}>
                          <Edit size={16} />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(project.id)}
                        className="hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

import { FolderKanban } from 'lucide-react';
