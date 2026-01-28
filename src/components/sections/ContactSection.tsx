import { useState } from 'react';
import { Linkedin, Mail, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlobDecoration } from '@/components/decorations/BlobDecoration';
import { useSiteConfig, useSectionConfig } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function ContactSection() {
  const { data: config, isLoading: configLoading } = useSiteConfig();
  const { data: sectionConfig, isLoading: sectionConfigLoading } = useSectionConfig('contact');
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Don't render if section is hidden
  if (!sectionConfigLoading && sectionConfig && !sectionConfig.is_visible) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        });

      if (error) throw error;

      setFormState('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset after 5 seconds
      setTimeout(() => setFormState('idle'), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      setFormState('idle');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Linkedin,
      customIconUrl: config?.linkedin_icon_url,
      label: 'LinkedIn',
      value: 'Connect with me',
      href: config?.social_linkedin || '#',
      show: !!config?.social_linkedin,
    },
    {
      icon: Mail,
      customIconUrl: config?.email_icon_url,
      label: 'Email',
      value: config?.social_email,
      href: config?.social_email ? `mailto:${config.social_email}` : '#',
      show: !!config?.social_email,
    },
    {
      icon: MapPin,
      customIconUrl: config?.location_icon_url,
      label: 'Location',
      value: config?.location,
      href: '#',
      show: !!config?.location,
    },
  ].filter(item => item.show);

  return (
    <section id="contact" className="relative section-padding overflow-hidden bg-card/50">
      <BlobDecoration 
        className="-right-48 -bottom-32 opacity-20" 
        size="xl" 
        variant="primary"
      />
      <BlobDecoration 
        className="-left-32 top-1/4 opacity-15" 
        size="lg" 
        variant="secondary"
      />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          {sectionConfigLoading ? (
            <>
              <Skeleton className="h-8 w-32 mx-auto mb-4" />
              <Skeleton className="h-12 w-64 mx-auto mb-6" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </>
          ) : (
            <>
              {sectionConfig?.tag && (
                <span className="inline-block px-4 py-2 rounded-pill bg-primary/10 text-primary text-sm font-medium mb-4">
                  {sectionConfig.tag}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                {sectionConfig?.title || "Let's Work"}{' '}
                <span className="text-primary">{sectionConfig?.title_highlight || 'Together'}</span>
              </h2>
              {sectionConfig?.description && (
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  {sectionConfig.description}
                </p>
              )}
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-8">
              Let's <span className="text-primary">Talk</span>
            </h3>

            {configLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))
            ) : contactInfo.length > 0 ? (
              contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  target={info.href.startsWith('http') ? '_blank' : undefined}
                  rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-primary/20 hover-lift group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors flex items-center justify-center overflow-hidden">
                    {info.customIconUrl ? (
                      <img 
                        src={info.customIconUrl} 
                        alt={`${info.label} icon`} 
                        className="w-7 h-7 object-contain"
                      />
                    ) : (
                      <info.icon size={24} className="text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{info.label}</div>
                    <div className="text-foreground font-medium">{info.value}</div>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-muted-foreground">Contact information not configured yet.</p>
            )}

            <p className="text-muted-foreground mt-8 leading-relaxed">
              I'm always open to discussing new projects, creative ideas, or opportunities 
              to be part of your visions. Feel free to reach out!
            </p>
          </div>

          {/* Contact Form */}
          <div className="p-8 rounded-2xl bg-card border border-primary/20">
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center h-full min-h-[400px] text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-foreground mb-3"
                  >
                    Message Sent!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-muted-foreground max-w-sm"
                  >
                    Thank you for reaching out! I'll get back to you within 24-48 hours.
                  </motion.p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project..."
                      required
                      className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="gap-2"
                      disabled={formState === 'submitting'}
                    >
                      {formState === 'submitting' ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
