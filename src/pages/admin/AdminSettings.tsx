import { useEffect, useState, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, X, Plus } from 'lucide-react';

interface SiteConfig {
  id?: string;
  name: string;
  title: string;
  title_2: string;
  title_3: string;
  title_4: string;
  hero_tag: string;
  bio_short: string;
  bio_long: string;
  profile_image_url: string;
  social_linkedin: string;
  social_email: string;
  location: string;
  linkedin_icon_url: string;
  email_icon_url: string;
  location_icon_url: string;
}

const initialConfig: SiteConfig = {
  name: 'Luccas Evans',
  title: 'Product Manager',
  title_2: '',
  title_3: '',
  title_4: '',
  hero_tag: 'Hello!',
  bio_short: '',
  bio_long: '',
  profile_image_url: '',
  social_linkedin: '',
  social_email: '',
  location: '',
  linkedin_icon_url: '',
  email_icon_url: '',
  location_icon_url: '',
};

export default function AdminSettings() {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState<string | null>(null);
  const { toast } = useToast();

  const linkedinIconRef = useRef<HTMLInputElement>(null);
  const emailIconRef = useRef<HTMLInputElement>(null);
  const locationIconRef = useRef<HTMLInputElement>(null);

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
        title_2: data.title_2 || '',
        title_3: data.title_3 || '',
        title_4: data.title_4 || '',
        hero_tag: data.hero_tag || '',
        bio_short: data.bio_short || '',
        bio_long: data.bio_long || '',
        profile_image_url: data.profile_image_url || '',
        social_linkedin: data.social_linkedin || '',
        social_email: data.social_email || '',
        location: data.location || '',
        linkedin_icon_url: data.linkedin_icon_url || '',
        email_icon_url: data.email_icon_url || '',
        location_icon_url: data.location_icon_url || '',
      });
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleIconUpload = async (file: File, iconType: 'linkedin' | 'email' | 'location') => {
    setUploadingIcon(iconType);

    const fileExt = file.name.split('.').pop();
    const fileName = `${iconType}-icon-${Date.now()}.${fileExt}`;
    const filePath = `contact-icons/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
      setUploadingIcon(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(filePath);

    const fieldName = `${iconType}_icon_url` as keyof SiteConfig;
    setConfig(prev => ({ ...prev, [fieldName]: publicUrl }));
    
    toast({ title: 'Icon uploaded successfully' });
    setUploadingIcon(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, iconType: 'linkedin' | 'email' | 'location') => {
    const file = e.target.files?.[0];
    if (file) {
      handleIconUpload(file, iconType);
    }
  };

  const removeIcon = (iconType: 'linkedin' | 'email' | 'location') => {
    const fieldName = `${iconType}_icon_url` as keyof SiteConfig;
    setConfig(prev => ({ ...prev, [fieldName]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const configData = {
      name: config.name,
      title: config.title,
      title_2: config.title_2 || null,
      title_3: config.title_3 || null,
      title_4: config.title_4 || null,
      hero_tag: config.hero_tag,
      bio_short: config.bio_short,
      bio_long: config.bio_long,
      profile_image_url: config.profile_image_url || null,
      social_linkedin: config.social_linkedin || null,
      social_email: config.social_email || null,
      location: config.location || null,
      linkedin_icon_url: config.linkedin_icon_url || null,
      email_icon_url: config.email_icon_url || null,
      location_icon_url: config.location_icon_url || null,
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

  const IconUploadField = ({ 
    label, 
    iconType, 
    iconUrl, 
    inputRef 
  }: { 
    label: string; 
    iconType: 'linkedin' | 'email' | 'location'; 
    iconUrl: string;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label} Icon</label>
      <div className="flex items-center gap-3">
        {iconUrl ? (
          <div className="relative group">
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
              <img src={iconUrl} alt={`${label} icon`} className="w-10 h-10 object-contain" />
            </div>
            <button
              type="button"
              onClick={() => removeIcon(iconType)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploadingIcon === iconType}
            className="w-14 h-14 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 flex items-center justify-center transition-colors"
          >
            {uploadingIcon === iconType ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            ) : (
              <Plus size={20} className="text-muted-foreground" />
            )}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, iconType)}
          className="hidden"
        />
        {iconUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploadingIcon === iconType}
          >
            <Upload size={14} className="mr-1" />
            Replace
          </Button>
        )}
      </div>
    </div>
  );

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
          
          {/* Name */}
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

          {/* Multiple Titles */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Titles / Roles
              <span className="text-muted-foreground font-normal ml-2">(will cycle with animation)</span>
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">Title 1 (Primary)</span>
                <input
                  type="text"
                  name="title"
                  value={config.title}
                  onChange={handleChange}
                  placeholder="Product Manager"
                  className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">Title 2</span>
                <input
                  type="text"
                  name="title_2"
                  value={config.title_2}
                  onChange={handleChange}
                  placeholder="UX Designer"
                  className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">Title 3</span>
                <input
                  type="text"
                  name="title_3"
                  value={config.title_3}
                  onChange={handleChange}
                  placeholder="Data Analyst"
                  className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">Title 4</span>
                <input
                  type="text"
                  name="title_4"
                  value={config.title_4}
                  onChange={handleChange}
                  placeholder="Tech Lead"
                  className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
                />
              </div>
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

          {/* Contact Icons */}
          <div className="grid md:grid-cols-3 gap-6">
            <IconUploadField 
              label="LinkedIn" 
              iconType="linkedin" 
              iconUrl={config.linkedin_icon_url}
              inputRef={linkedinIconRef}
            />
            <IconUploadField 
              label="Email" 
              iconType="email" 
              iconUrl={config.email_icon_url}
              inputRef={emailIconRef}
            />
            <IconUploadField 
              label="Location" 
              iconType="location" 
              iconUrl={config.location_icon_url}
              inputRef={locationIconRef}
            />
          </div>

          {/* Contact Info URLs */}
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
