import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { FolderKanban, FileText, Briefcase, Gauge, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stats {
  projects: number;
  blogPosts: number;
  experiences: number;
  skills: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, blogPosts: 0, experiences: 0, skills: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [projects, blogPosts, experiences, skills] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('experiences').select('id', { count: 'exact', head: true }),
        supabase.from('skills').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        projects: projects.count ?? 0,
        blogPosts: blogPosts.count ?? 0,
        experiences: experiences.count ?? 0,
        skills: skills.count ?? 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, href: '/admin/projects', color: 'text-primary' },
    { label: 'Blog Posts', value: stats.blogPosts, icon: FileText, href: '/admin/blog', color: 'text-coral' },
    { label: 'Experiences', value: stats.experiences, icon: Briefcase, href: '/admin/experiences', color: 'text-secondary' },
    { label: 'Skills', value: stats.skills, icon: Gauge, href: '/admin/skills', color: 'text-green-500' },
  ];

  const quickActions = [
    { label: 'Add Project', href: '/admin/projects/new' },
    { label: 'Write Blog Post', href: '/admin/blog/new' },
    { label: 'Add Experience', href: '/admin/experiences/new' },
    { label: 'Update Settings', href: '/admin/settings' },
  ];

  return (
    <AdminLayout title="Dashboard" description="Welcome back! Here's an overview of your portfolio.">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.href}
            className="p-6 rounded-2xl bg-card border border-primary/20 hover-lift group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-muted group-hover:bg-primary/20 transition-colors`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <Eye size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {loading ? '...' : stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-primary/20 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="px-4 py-3 rounded-xl bg-muted text-center text-sm font-medium text-foreground hover:bg-primary/20 hover:text-primary transition-all"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-card border border-primary/20 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>👋 Welcome to your portfolio admin panel!</p>
          <p>• Use the sidebar to navigate between sections</p>
          <p>• Add your projects, experiences, and skills</p>
          <p>• Write blog posts to share your insights</p>
          <p>• Customize site settings to personalize your portfolio</p>
        </div>
      </div>
    </AdminLayout>
  );
}
