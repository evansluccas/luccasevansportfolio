import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

interface SiteConfig {
  id?: string;
  name: string;
  title: string;
  hero_tag: string;
  bio_short: string;
  bio_long: string;
  profile_image_url: string;
  social_linkedin: string;
  social_email: string;
  location: string;
}

const initialConfig: SiteConfig = {
  name: 'Luccas Evans',
  title: 'Product Manager',
  hero_tag: 'Hello!',
  bio_short: '',
  bio_long: '',
  profile_image_url: '',
  social_linkedin: '',
  social_email: '',
  location: '',
};

export default function AdminSettings() {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      toast({ title: 'Error fetching settings', description: error.message, variant: 'destructive' });
    } else if (data) {
      setConfig({
        id: data.id,
        name: data.name,
        title: data.title,
        hero_tag: data.hero_tag || '',
        bio_short: data.bio_short || '',
        bio_long: data.bio_long || '',
        profile_image_url: data.profile_image_url || '',
        social_linkedin: data.social_linkedin || '',
        social_email: data.social_email || '',
        location: data.location || '',
      });
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const configData = {
      name: config.name,
      title: config.title,
      hero_tag: config.hero_tag,
      bio_short: config.bio_short,
      bio_long: config.bio_long,
      profile_image_url: config.profile_image_url || null,
      social_linkedin: config.social_linkedin || null,
      social_email: config.social_email || null,
      location: config.location || null,
    };

    let error;
    if (config.id) {
      ({ error } = await supabase.from('site_config').update(configData).eq('id', config.id));
    } else {
      ({ error } = await supabase.from('site_config').insert(configData));
    }

    if (error) {
      toast({ title: 'Error saving settings', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Settings saved successfully' });
      fetchConfig();
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout title="Settings">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings" description="Manage your portfolio configuration">
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-card border border-primary/20 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-semibold border-b border-primary/10 pb-4">Personal Information</h3>
          
          {/* Name & Title */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={config.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title / Role</label>
              <input
                type="text"
                name="title"
                value={config.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Hero Tag & Profile Image */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Hero Tag (e.g., "Hello!")</label>
              <input
                type="text"
                name="hero_tag"
                value={config.hero_tag}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Profile Image URL</label>
              <input
                type="url"
                name="profile_image_url"
                value={config.profile_image_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Bio Short */}
          <div>
            <label className="block text-sm font-medium mb-2">Short Bio (Hero Section)</label>
            <textarea
              name="bio_short"
              value={config.bio_short}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none resize-none"
            />
          </div>

          {/* Bio Long */}
          <div>
            <label className="block text-sm font-medium mb-2">Long Bio (About Section)</label>
            <textarea
              name="bio_long"
              value={config.bio_long}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <h3 className="text-lg font-semibold border-b border-primary/10 pb-4 pt-4">Contact Information</h3>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="social_linkedin"
                value={config.social_linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="social_email"
                value={config.social_email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={config.location}
                onChange={handleChange}
                placeholder="São Paulo, Brazil"
                className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-primary/10">
            <Button type="submit" disabled={saving}>
              <Save size={18} className="mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
