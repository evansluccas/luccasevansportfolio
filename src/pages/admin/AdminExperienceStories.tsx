import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, GripVertical, Image } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ExperienceStory {
  id: string;
  image_url: string;
  caption: string;
  display_order: number;
}

export default function AdminExperienceStories() {
  const [stories, setStories] = useState<ExperienceStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    image_url: '',
    caption: '',
    display_order: 0,
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('experience_stories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Failed to fetch stories');
      console.error(error);
    } else {
      setStories(data || []);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      image_url: '',
      caption: '',
      display_order: stories.length,
    });
    setEditingId(null);
  };

  const handleEdit = (story: ExperienceStory) => {
    setEditingId(story.id);
    setFormData({
      image_url: story.image_url,
      caption: story.caption,
      display_order: story.display_order,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image_url.trim()) {
      toast.error('Image URL is required');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('experience_stories')
        .update({
          image_url: formData.image_url,
          caption: formData.caption,
          display_order: formData.display_order,
        })
        .eq('id', editingId);

      if (error) {
        toast.error('Failed to update story');
        console.error(error);
      } else {
        toast.success('Story updated successfully');
        resetForm();
        fetchStories();
      }
    } else {
      const { error } = await supabase
        .from('experience_stories')
        .insert({
          image_url: formData.image_url,
          caption: formData.caption,
          display_order: stories.length,
        });

      if (error) {
        toast.error('Failed to add story');
        console.error(error);
      } else {
        toast.success('Story added successfully');
        resetForm();
        fetchStories();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    const { error } = await supabase
      .from('experience_stories')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete story');
      console.error(error);
    } else {
      toast.success('Story deleted successfully');
      fetchStories();
    }
  };

  const moveStory = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= stories.length) return;

    const updatedStories = [...stories];
    [updatedStories[index], updatedStories[newIndex]] = [updatedStories[newIndex], updatedStories[index]];

    // Update display orders
    const updates = updatedStories.map((story, i) => ({
      id: story.id,
      display_order: i,
    }));

    for (const update of updates) {
      await supabase
        .from('experience_stories')
        .update({ display_order: update.display_order })
        .eq('id', update.id);
    }

    fetchStories();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Experience Stories</h1>
        <p className="text-muted-foreground">
          Manage the story carousel images that appear alongside your experience timeline.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-card rounded-xl border border-primary/20 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {editingId ? 'Edit Story' : 'Add New Story'}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="bg-background"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="A brief description of this moment..."
              rows={3}
              className="bg-background"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit">
            {editingId ? (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Update Story
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Story
              </>
            )}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Stories List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Current Stories</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="p-8 text-center bg-card rounded-xl border border-primary/20">
            <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No stories yet. Add your first story above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stories.map((story, index) => (
              <div
                key={story.id}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-primary/20"
              >
                {/* Reorder Controls */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveStory(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <GripVertical className="w-4 h-4 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStory(index, 'down')}
                    disabled={index === stories.length - 1}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Preview Image */}
                <div className="w-16 h-16 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                  {story.image_url ? (
                    <img
                      src={story.image_url}
                      alt={story.caption}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Caption */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground line-clamp-2">
                    {story.caption || <span className="text-muted-foreground italic">No caption</span>}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(story)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(story.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
