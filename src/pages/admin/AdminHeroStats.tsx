import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeroStat {
  id: string;
  number: string;
  unit: string;
  description: string;
  icon: string;
  display_order: number;
}

const iconOptions = ['Briefcase', 'Coffee', 'Award', 'Users', 'Star', 'Code', 'Rocket', 'Heart'];

export default function AdminHeroStats() {
  const [stats, setStats] = useState<HeroStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    number: '',
    unit: '',
    description: '',
    icon: 'Briefcase',
    display_order: 0,
  });
  const { toast } = useToast();

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('hero_stats')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setStats(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ number: '', unit: '', description: '', icon: 'Briefcase', display_order: 0 });
  };

  const handleEdit = async (id: string) => {
    const { data } = await supabase.from('hero_stats').select('*').eq('id', id).single();
    if (data) {
      setEditingId(id);
      setFormData({
        number: data.number,
        unit: data.unit,
        description: data.description,
        icon: data.icon,
        display_order: data.display_order,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let error;
    if (editingId) {
      ({ error } = await supabase.from('hero_stats').update(formData).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('hero_stats').insert(formData));
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Stat ${editingId ? 'updated' : 'added'}` });
      resetForm();
      fetchStats();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this stat?')) return;
    const { error } = await supabase.from('hero_stats').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Stat deleted' });
      fetchStats();
    }
  };

  return (
    <AdminLayout title="Hero Stats" description="Manage the statistics displayed in your hero section">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-card border border-primary/20 rounded-2xl p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Stat</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Number (e.g., 7+) *"
                value={formData.number}
                onChange={e => setFormData({...formData, number: e.target.value})}
                required
                className="px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Unit (e.g., years) *"
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value})}
                required
                className="px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Description (e.g., Building products) *"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.icon}
                onChange={e => setFormData({...formData, icon: e.target.value})}
                className="px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Order"
                value={formData.display_order}
                onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                className="px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                {editingId ? 'Update' : 'Add'} Stat
              </Button>
              {editingId && (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preview</h3>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : stats.length === 0 ? (
            <div className="text-center py-12 bg-card border border-primary/20 rounded-2xl">
              <BarChart3 size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No stats yet</h3>
              <p className="text-muted-foreground">Add your first hero stat</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {stats.map(stat => (
                <div key={stat.id} className="p-4 rounded-xl bg-card border border-primary/20 card-diagonal-lines relative group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/20">
                      <span className="text-primary text-xs font-bold">{stat.icon.slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.number}</div>
                      <div className="text-xs text-muted-foreground uppercase">{stat.unit}</div>
                      <div className="text-sm text-muted-foreground mt-1">{stat.description}</div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(stat.id)}>
                      <Edit size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => handleDelete(stat.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
