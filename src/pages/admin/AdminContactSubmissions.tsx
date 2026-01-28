import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Trash2, Mail, MailOpen, Loader2, Inbox } from 'lucide-react';
import { format } from 'date-fns';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminContactSubmissions() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContactSubmission[];
    },
  });

  const toggleReadMutation = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update submission status.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      toast({
        title: 'Deleted',
        description: 'Submission deleted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete submission.',
        variant: 'destructive',
      });
    },
  });

  const unreadCount = submissions?.filter(s => !s.is_read).length || 0;

  return (
    <AdminLayout title="Contact Submissions">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Contact Submissions</h1>
            <p className="text-muted-foreground mt-1">
              {submissions?.length || 0} total • {unreadCount} unread
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : submissions?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No submissions yet</h3>
            <p className="text-muted-foreground">Contact form submissions will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions?.map((submission) => (
              <div
                key={submission.id}
                className={`p-6 rounded-xl border transition-all ${
                  submission.is_read 
                    ? 'bg-card border-primary/10' 
                    : 'bg-primary/5 border-primary/30'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      setExpandedId(expandedId === submission.id ? null : submission.id);
                      if (!submission.is_read) {
                        toggleReadMutation.mutate({ id: submission.id, is_read: true });
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {!submission.is_read && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                      <h3 className="font-semibold">{submission.subject}</h3>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                      <span className="font-medium text-foreground">{submission.name}</span>
                      <a 
                        href={`mailto:${submission.email}`} 
                        className="hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {submission.email}
                      </a>
                      <span>
                        {format(new Date(submission.created_at), 'MMM d, yyyy • h:mm a')}
                      </span>
                    </div>
                    {expandedId === submission.id ? (
                      <p className="text-foreground whitespace-pre-wrap mt-4 p-4 bg-muted/50 rounded-lg">
                        {submission.message}
                      </p>
                    ) : (
                      <p className="text-muted-foreground line-clamp-2">
                        {submission.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleReadMutation.mutate({ 
                        id: submission.id, 
                        is_read: !submission.is_read 
                      })}
                      title={submission.is_read ? 'Mark as unread' : 'Mark as read'}
                    >
                      {submission.is_read ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        <MailOpen className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(submission.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
