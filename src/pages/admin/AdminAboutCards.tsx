import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AboutCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
}

const iconOptions = ['MessageSquare', 'Lightbulb', 'Code2', 'Users', 'Target', 'Zap', 'Briefcase', 'Award'];

export default function AdminAboutCards() {
  const [cards, setCards] = useState<AboutCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Lightbulb',
    display_order: 0,
  });
  const { toast } = useToast();

  const fetchCards = async () => {
    const { data, error } = await supabase
      .from('about_cards')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setCards(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', icon: 'Lightbulb', display_order: 0 });
  };

  const handleEdit = async (id: string) => {
    const { data } = await supabase.from('about_cards').select('*').eq('id', id).single();
    if (data) {
      setEditingId(id);
      setFormData({
        title: data.title,
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
      ({ error } = await supabase.from('about_cards').update(formData).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('about_cards').insert(formData));
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Card ${editingId ? 'updated' : 'added'}` });
      resetForm();
      fetchCards();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this card?')) return;
    const { error } = await supabase.from('about_cards').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Card deleted' });
      fetchCards();
    }
  };

  return (
    <AdminLayout title="About Cards" description="Manage the cards in your About section">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-card border border-primary/20 rounded-2xl p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Card</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title *"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
            />
            <textarea
              placeholder="Description *"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none resize-none"
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
            <input
              type="number"
              placeholder="Display Order"
              value={formData.display_order}
              onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
            />
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                {editingId ? 'Update' : 'Add'} Card
              </Button>
              {editingId && (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-12 bg-card border border-primary/20 rounded-2xl">
              <MessageSquare size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No cards yet</h3>
              <p className="text-muted-foreground">Add your first about card</p>
            </div>
          ) : (
            cards.map(card => (
              <div key={card.id} className="p-4 rounded-xl bg-card border border-primary/20">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-md bg-primary/20 text-primary text-xs">{card.icon}</span>
                      <h4 className="font-semibold text-foreground">{card.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(card.id)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(card.id)} className="hover:text-destructive">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
