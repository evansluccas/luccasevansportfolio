import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, BarChart3, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeroStat {
  id: string;
  number: string;
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
    description: '',
    icon: 'Briefcase',
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
    setFormData({ number: '', description: '', icon: 'Briefcase' });
  };

  const handleEdit = async (id: string) => {
    const { data } = await supabase.from('hero_stats').select('*').eq('id', id).single();
    if (data) {
      setEditingId(id);
      setFormData({
        number: data.number,
        description: data.description,
        icon: data.icon,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let error;
    if (editingId) {
      ({ error } = await supabase.from('hero_stats').update({
        ...formData,
        unit: formData.number, // Keep unit in sync with number for backwards compatibility
      }).eq('id', editingId));
    } else {
      const newOrder = stats.length;
      ({ error } = await supabase.from('hero_stats').insert({
        ...formData,
        unit: formData.number,
        display_order: newOrder,
      }));
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

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    
    const newStats = [...stats];
    const currentStat = newStats[index];
    const prevStat = newStats[index - 1];
    
    // Swap display_order values
    const { error: error1 } = await supabase
      .from('hero_stats')
      .update({ display_order: prevStat.display_order })
      .eq('id', currentStat.id);
    
    const { error: error2 } = await supabase
      .from('hero_stats')
      .update({ display_order: currentStat.display_order })
      .eq('id', prevStat.id);

    if (error1 || error2) {
      toast({ title: 'Error', description: 'Failed to reorder', variant: 'destructive' });
    } else {
      fetchStats();
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === stats.length - 1) return;
    
    const newStats = [...stats];
    const currentStat = newStats[index];
    const nextStat = newStats[index + 1];
    
    // Swap display_order values
    const { error: error1 } = await supabase
      .from('hero_stats')
      .update({ display_order: nextStat.display_order })
      .eq('id', currentStat.id);
    
    const { error: error2 } = await supabase
      .from('hero_stats')
      .update({ display_order: currentStat.display_order })
      .eq('id', nextStat.id);

    if (error1 || error2) {
      toast({ title: 'Error', description: 'Failed to reorder', variant: 'destructive' });
    } else {
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
            <input
              type="text"
              placeholder="Number (e.g., 7+ years) *"
              value={formData.number}
              onChange={e => setFormData({...formData, number: e.target.value})}
              required
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              placeholder="Description (e.g., Building products) *"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
            />
            <select
              value={formData.icon}
              onChange={e => setFormData({...formData, icon: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
            >
              {iconOptions.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
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
          <h3 className="text-lg font-semibold">Preview (drag to reorder)</h3>
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
            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={stat.id} className="p-4 rounded-xl bg-card border border-primary/20 card-diagonal-lines relative group flex items-center gap-4">
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      <ArrowUp size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === stats.length - 1}
                    >
                      <ArrowDown size={14} />
                    </Button>
                  </div>
                  
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-full bg-primary/20">
                      <span className="text-primary text-xs font-bold">{stat.icon.slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.number}</div>
                      <div className="text-sm text-muted-foreground mt-1">{stat.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
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
