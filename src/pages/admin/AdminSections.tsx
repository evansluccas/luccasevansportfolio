import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, EyeOff, Save } from 'lucide-react';

interface SectionConfig {
  id: string;
  section_key: string;
  tag: string | null;
  title: string;
  title_highlight: string | null;
  description: string | null;
  is_visible: boolean;
  display_order: number;
}

const SECTION_LABELS: Record<string, string> = {
  about: 'About Section',
  experience: 'Experience Section',
  skills: 'Skills Section',
  projects: 'Projects Section',
  contact: 'Contact Section',
};

export default function AdminSections() {
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('section_config')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (section: SectionConfig) => {
    try {
      const { error } = await supabase
        .from('section_config')
        .update({ is_visible: !section.is_visible })
        .eq('id', section.id);

      if (error) throw error;
      
      setSections(sections.map(s => 
        s.id === section.id ? { ...s, is_visible: !s.is_visible } : s
      ));
      
      toast.success(`Section ${section.is_visible ? 'hidden' : 'visible'}`);
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  const handleSave = async (section: SectionConfig) => {
    setSaving(section.id);
    try {
      const { error } = await supabase
        .from('section_config')
        .update({
          tag: section.tag,
          title: section.title,
          title_highlight: section.title_highlight,
          description: section.description,
        })
        .eq('id', section.id);

      if (error) throw error;
      toast.success('Section updated successfully');
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('Failed to save section');
    } finally {
      setSaving(null);
    }
  };

  const handleFieldChange = (sectionId: string, field: keyof SectionConfig, value: string | boolean) => {
    setSections(sections.map(s => 
      s.id === sectionId ? { ...s, [field]: value } : s
    ));
  };

  return (
    <AdminLayout 
      title="Sections" 
      description="Manage section headers, descriptions, and visibility for each section of your portfolio."
    >
      <div className="space-y-8">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))
        ) : sections.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No sections configured yet.
          </div>
        ) : (
          sections.map((section) => (
            <div
              key={section.id}
              className={`p-6 bg-card rounded-xl border transition-all ${
                section.is_visible 
                  ? 'border-primary/20' 
                  : 'border-muted opacity-60'
              }`}
            >
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    {SECTION_LABELS[section.section_key] || section.section_key}
                  </h3>
                  {section.is_visible ? (
                    <Eye className="w-4 h-4 text-primary" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`visible-${section.id}`} className="text-sm text-muted-foreground">
                      Visible
                    </Label>
                    <Switch
                      id={`visible-${section.id}`}
                      checked={section.is_visible}
                      onCheckedChange={() => handleToggleVisibility(section)}
                    />
                  </div>
                </div>
              </div>

              {/* Section Form */}
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`tag-${section.id}`} className="text-sm text-muted-foreground">
                      Tag
                    </Label>
                    <Input
                      id={`tag-${section.id}`}
                      value={section.tag || ''}
                      onChange={(e) => handleFieldChange(section.id, 'tag', e.target.value)}
                      placeholder="e.g., About me"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`title-${section.id}`} className="text-sm text-muted-foreground">
                      Title
                    </Label>
                    <Input
                      id={`title-${section.id}`}
                      value={section.title}
                      onChange={(e) => handleFieldChange(section.id, 'title', e.target.value)}
                      placeholder="e.g., Professional"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`highlight-${section.id}`} className="text-sm text-muted-foreground">
                      Title Highlight
                    </Label>
                    <Input
                      id={`highlight-${section.id}`}
                      value={section.title_highlight || ''}
                      onChange={(e) => handleFieldChange(section.id, 'title_highlight', e.target.value)}
                      placeholder="e.g., Experience"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`description-${section.id}`} className="text-sm text-muted-foreground">
                    Description
                  </Label>
                  <Textarea
                    id={`description-${section.id}`}
                    value={section.description || ''}
                    onChange={(e) => handleFieldChange(section.id, 'description', e.target.value)}
                    placeholder="Section description..."
                    rows={2}
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSave(section)}
                    disabled={saving === section.id}
                    size="sm"
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving === section.id ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-background rounded-lg border border-muted">
                <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                <div className="text-center">
                  {section.tag && (
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-2">
                      {section.tag}
                    </span>
                  )}
                  <h4 className="text-xl font-bold">
                    {section.title} {section.title_highlight && (
                      <span className="text-primary">{section.title_highlight}</span>
                    )}
                  </h4>
                  {section.description && (
                    <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                      {section.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
