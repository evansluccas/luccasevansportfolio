import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, GripVertical, Image, Upload, X } from 'lucide-react';
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
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    image_url: '',
    caption: '',
    display_order: 0,
  });

  useEffect(() => {
    fetchStories();
  }, []);

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
    setSelectedFile(null);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = (story: ExperienceStory) => {
    setEditingId(story.id);
    setFormData({
      image_url: story.image_url,
      caption: story.caption,
      display_order: story.display_order,
    });
    setSelectedFile(null);
    setPreviewUrl(story.image_url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `experience-stories/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error('Failed to upload image');
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if we have an image (either new file or existing URL when editing)
    if (!selectedFile && !formData.image_url) {
      toast.error('Please select an image');
      return;
    }

    setIsUploading(true);
    let imageUrl = formData.image_url;

    // Upload new file if selected
    if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile);
      if (!uploadedUrl) {
        setIsUploading(false);
        return;
      }
      imageUrl = uploadedUrl;
    }

    if (editingId) {
      const { error } = await supabase
        .from('experience_stories')
        .update({
          image_url: imageUrl,
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
          image_url: imageUrl,
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
    setIsUploading(false);
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
    <AdminLayout title="Experience Stories" description="Manage the story carousel images that appear alongside your experience timeline">
      <div className="space-y-8">

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-card rounded-xl border border-primary/20 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {editingId ? 'Edit Story' : 'Add New Story'}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            
            {previewUrl ? (
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-primary/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (previewUrl.startsWith('blob:')) {
                      URL.revokeObjectURL(previewUrl);
                    }
                    setPreviewUrl(null);
                    setFormData({ ...formData, image_url: '' });
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary/50 bg-background transition-colors"
              >
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Upload</span>
              </label>
            )}
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
          <Button type="submit" disabled={isUploading}>
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-pulse" />
                Uploading...
              </>
            ) : editingId ? (
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
    </AdminLayout>
  );
}
