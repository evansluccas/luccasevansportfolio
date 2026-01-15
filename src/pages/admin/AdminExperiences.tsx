import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Experience {
  id: string;
  position: string;
  company: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  employment_type: string;
  display_order: number;
}

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    technologies: '',
    employment_type: 'Full-time',
    display_order: 0,
  });
  const { toast } = useToast();

  const fetchExperiences = async () => {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({ title: 'Error fetching experiences', description: error.message, variant: 'destructive' });
    } else {
      setExperiences(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      position: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      description: '',
      technologies: '',
      employment_type: 'Full-time',
      display_order: 0,
    });
  };

  const handleEdit = async (id: string) => {
    const { data } = await supabase.from('experiences').select('*').eq('id', id).single();
    if (data) {
      setEditingId(id);
      setFormData({
        position: data.position,
        company: data.company,
        location: data.location || '',
        start_date: data.start_date,
        end_date: data.end_date || '',
        description: data.description || '',
        technologies: (data.technologies || []).join(', '),
        employment_type: data.employment_type || 'Full-time',
        display_order: data.display_order,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const expData = {
      position: formData.position,
      company: formData.company,
      location: formData.location || null,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
      description: formData.description || null,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      employment_type: formData.employment_type,
      display_order: formData.display_order,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('experiences').update(expData).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('experiences').insert(expData));
    }

    if (error) {
      toast({ title: 'Error saving experience', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Experience ${editingId ? 'updated' : 'added'} successfully` });
      resetForm();
      fetchExperiences();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Experience deleted' });
      fetchExperiences();
    }
  };

  return (
    <AdminLayout title="Experiences" description="Manage your professional experiences">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-card border border-primary/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Experience</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Position *"
                value={formData.position}
                onChange={e => setFormData({...formData, position: e.target.value})}
                required
                className="px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Company *"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
                required
                className="px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Start Date *</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={e => setFormData({...formData, start_date: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={e => setFormData({...formData, end_date: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none resize-none"
            />
            <input
              type="text"
              placeholder="Technologies (comma-separated)"
              value={formData.technologies}
              onChange={e => setFormData({...formData, technologies: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.employment_type}
                onChange={e => setFormData({...formData, employment_type: e.target.value})}
                className="px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
                <option value="Contract">Contract</option>
              </select>
              <input
                type="number"
                placeholder="Display Order"
                value={formData.display_order}
                onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                className="px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                {editingId ? 'Update' : 'Add'} Experience
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
          ) : experiences.length === 0 ? (
            <div className="text-center py-12 bg-card border border-primary/20 rounded-2xl">
              <Briefcase size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No experiences yet</h3>
              <p className="text-muted-foreground">Add your first experience</p>
            </div>
          ) : (
            experiences.map(exp => (
              <div key={exp.id} className="p-4 rounded-xl bg-card border border-primary/20 flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{exp.position}</h4>
                  <p className="text-primary text-sm">{exp.company}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {exp.start_date} - {exp.end_date || 'Present'} • {exp.employment_type}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(exp.id)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(exp.id)} className="hover:text-destructive">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
