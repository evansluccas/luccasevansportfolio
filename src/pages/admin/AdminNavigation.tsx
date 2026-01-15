import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, GripVertical, Eye, EyeOff, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface NavLink {
  id: string;
  label: string;
  href: string;
  display_order: number;
  is_visible: boolean;
}

export default function AdminNavigation() {
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNavLinks();
  }, []);

  const fetchNavLinks = async () => {
    const { data, error } = await supabase
      .from('nav_links')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({ title: 'Error fetching navigation', description: error.message, variant: 'destructive' });
    } else {
      setNavLinks(data || []);
    }
    setLoading(false);
  };

  const handleChange = (id: string, field: keyof NavLink, value: string | boolean) => {
    setNavLinks(prev =>
      prev.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const handleAddLink = () => {
    const newLink: NavLink = {
      id: `temp-${Date.now()}`,
      label: 'New Link',
      href: '#section',
      display_order: navLinks.length + 1,
      is_visible: true,
    };
    setNavLinks([...navLinks, newLink]);
  };

  const handleRemoveLink = async (id: string) => {
    if (id.startsWith('temp-')) {
      setNavLinks(prev => prev.filter(link => link.id !== id));
      return;
    }

    const { error } = await supabase.from('nav_links').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error deleting link', description: error.message, variant: 'destructive' });
    } else {
      setNavLinks(prev => prev.filter(link => link.id !== id));
      toast({ title: 'Link deleted successfully' });
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      for (const link of navLinks) {
        const linkData = {
          label: link.label,
          href: link.href,
          display_order: link.display_order,
          is_visible: link.is_visible,
        };

        if (link.id.startsWith('temp-')) {
          const { error } = await supabase.from('nav_links').insert(linkData);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('nav_links').update(linkData).eq('id', link.id);
          if (error) throw error;
        }
      }

      toast({ title: 'Navigation saved successfully' });
      fetchNavLinks();
    } catch (error: any) {
      toast({ title: 'Error saving navigation', description: error.message, variant: 'destructive' });
    }

    setSaving(false);
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === navLinks.length - 1)
    ) {
      return;
    }

    const newLinks = [...navLinks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap display_order values
    const tempOrder = newLinks[index].display_order;
    newLinks[index].display_order = newLinks[targetIndex].display_order;
    newLinks[targetIndex].display_order = tempOrder;
    
    // Swap positions in array
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
    
    setNavLinks(newLinks);
  };

  if (loading) {
    return (
      <AdminLayout title="Navigation">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Header Navigation" 
      description="Configure the navigation links that appear in your portfolio header"
    >
      <div className="max-w-3xl">
        <div className="bg-card border border-primary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Navigation Links</h3>
            <Button onClick={handleAddLink} size="sm">
              <Plus size={18} className="mr-2" />
              Add Link
            </Button>
          </div>

          <div className="space-y-4">
            {navLinks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No navigation links yet. Add your first link above.
              </p>
            ) : (
              navLinks.map((link, index) => (
                <div
                  key={link.id}
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-primary/10"
                >
                  {/* Reorder Controls */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveLink(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <GripVertical size={16} className="rotate-180" />
                    </button>
                    <button
                      onClick={() => moveLink(index, 'down')}
                      disabled={index === navLinks.length - 1}
                      className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <GripVertical size={16} />
                    </button>
                  </div>

                  {/* Label Input */}
                  <div className="flex-1">
                    <label className="block text-xs text-muted-foreground mb-1">Label</label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleChange(link.id, 'label', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none text-sm"
                      placeholder="Home"
                    />
                  </div>

                  {/* Href Input */}
                  <div className="flex-1">
                    <label className="block text-xs text-muted-foreground mb-1">Link (href)</label>
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => handleChange(link.id, 'href', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none text-sm"
                      placeholder="#home"
                    />
                  </div>

                  {/* Visibility Toggle */}
                  <div className="flex flex-col items-center gap-1">
                    <label className="block text-xs text-muted-foreground">Visible</label>
                    <Switch
                      checked={link.is_visible}
                      onCheckedChange={(checked) => handleChange(link.id, 'is_visible', checked)}
                    />
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLink(link.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6 pt-6 border-t border-primary/10">
            <Button onClick={handleSave} disabled={saving}>
              <Save size={18} className="mr-2" />
              {saving ? 'Saving...' : 'Save Navigation'}
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-8 bg-card border border-primary/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="bg-background rounded-pill border border-primary/20 p-4 flex items-center justify-center gap-4">
            {navLinks
              .filter(link => link.is_visible)
              .map(link => (
                <span key={link.id} className="text-sm text-foreground/80 hover:text-primary cursor-pointer transition-colors">
                  {link.label}
                </span>
              ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}