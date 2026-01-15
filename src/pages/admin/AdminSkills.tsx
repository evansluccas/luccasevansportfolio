import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Gauge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  featured: boolean;
  display_order: number;
}

const categories = ['Product Management', 'Technical Skills', 'Tools & Platforms', 'Soft Skills'];

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Product Management',
    proficiency: 80,
    icon: '',
    featured: false,
    display_order: 0,
  });
  const { toast } = useToast();

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('display_order', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setSkills(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Product Management',
      proficiency: 80,
      icon: '',
      featured: false,
      display_order: 0,
    });
  };

  const handleEdit = async (id: string) => {
    const { data } = await supabase.from('skills').select('*').eq('id', id).single();
    if (data) {
      setEditingId(id);
      setFormData({
        name: data.name,
        category: data.category,
        proficiency: data.proficiency,
        icon: data.icon || '',
        featured: data.featured,
        display_order: data.display_order,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const skillData = {
      name: formData.name,
      category: formData.category,
      proficiency: formData.proficiency,
      icon: formData.icon || null,
      featured: formData.featured,
      display_order: formData.display_order,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('skills').update(skillData).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('skills').insert(skillData));
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Skill ${editingId ? 'updated' : 'added'}` });
      resetForm();
      fetchSkills();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Skill deleted' });
      fetchSkills();
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <AdminLayout title="Skills" description="Manage your skills and competencies">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-card border border-primary/20 rounded-2xl p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Skill</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Skill Name *"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
            />
            <select
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Proficiency: {formData.proficiency}%</label>
              <input
                type="range"
                min={0}
                max={100}
                value={formData.proficiency}
                onChange={e => setFormData({...formData, proficiency: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
            <input
              type="number"
              placeholder="Display Order"
              value={formData.display_order}
              onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
            />
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={e => setFormData({...formData, featured: e.target.checked})}
                className="w-5 h-5"
              />
              <span className="text-sm">Featured Skill</span>
            </label>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                {editingId ? 'Update' : 'Add'}
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
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : skills.length === 0 ? (
            <div className="text-center py-12 bg-card border border-primary/20 rounded-2xl">
              <Gauge size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No skills yet</h3>
              <p className="text-muted-foreground">Add your first skill</p>
            </div>
          ) : (
            Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="bg-card border border-primary/20 rounded-2xl p-6">
                <h4 className="text-primary font-semibold mb-4">{category}</h4>
                <div className="space-y-3">
                  {categorySkills.map(skill => (
                    <div key={skill.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-xs text-muted-foreground">{skill.proficiency}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(skill.id)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(skill.id)} className="hover:text-destructive">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
