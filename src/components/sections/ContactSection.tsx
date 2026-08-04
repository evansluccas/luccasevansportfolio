import { useState } from 'react';
import { Linkedin, Mail, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteConfig, useSectionConfig } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
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
      label: 'LinkedIn',
      value: 'Connect with me',
      href: config?.social_linkedin || '#',
      show: !!config?.social_linkedin,
    },
    {
      icon: Mail,
      label: 'Email',
      value: config?.social_email,
      href: config?.social_email ? `mailto:${config.social_email}` : '#',
      show: !!config?.social_email,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: config?.location,
      href: '#',
      show: !!config?.location,
    },
  ].filter(item => item.show);


  return (
    <section id="contact" className="relative section-padding overflow-hidden bg-background">
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-14">
          {sectionConfigLoading ? (
            <>
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-12 w-64 mb-6" />
              <Skeleton className="h-6 w-96" />
            </>
          ) : (
            <>
              {sectionConfig?.tag && (
                <span className="inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  {sectionConfig.tag}
                </span>
              )}
              <h2 className="text-[1.9rem] leading-tight sm:text-4xl lg:text-5xl mb-4 sm:mb-5">
                {sectionConfig?.title || "Let's Work"}{' '}
                <span className="italic text-accent">{sectionConfig?.title_highlight || 'Together'}</span>
              </h2>
              {sectionConfig?.description && (
                <p className="text-muted-foreground text-[0.95rem] sm:text-lg">
                  {sectionConfig.description}
                </p>
              )}
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 border-t border-border pt-8 sm:pt-10">
          {/* Contact Info */}
          <div>
            <h3 className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground mb-6">
              Direct channels
            </h3>

            {configLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-none" />
                ))}
              </div>
            ) : contactInfo.length > 0 ? (
              <ul className="border-t border-border">
                {contactInfo.map((info, index) => (
                  <Reveal
                    key={index}
                    as="li"
                    immediate={index === 0}
                    delay={index === 0 ? 0 : 0.1}
                  >
                    <a
                      href={info.href}
                      target={info.href.startsWith('http') ? '_blank' : undefined}
                      rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="group flex items-center gap-4 py-5 border-b border-border transition-colors hover:bg-secondary/15"
                    >
                      <div className="w-9 h-9 flex items-center justify-center overflow-hidden shrink-0">
                        <info.icon size={20} strokeWidth={1.5} className="text-accent" />
                      </div>

                      <div>
                        <div className="text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">{info.label}</div>
                        <div className="text-foreground">{info.value}</div>
                      </div>
                    </a>
                  </Reveal>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Contact information not configured yet.</p>
            )}

            <p className="text-muted-foreground text-sm mt-8 leading-relaxed max-w-md">
              I'm always open to discussing new projects, creative ideas, or opportunities 
              to be part of your visions. Feel free to reach out!
            </p>
          </div>

          {/* Contact Form */}
          <div className="p-5 sm:p-8 rounded-lg bg-card border border-border shadow-card">
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
                    className="w-16 h-16 rounded-full bg-secondary/40 flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-8 h-8 text-accent" strokeWidth={1.5} />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl text-foreground mb-3"
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
                        className="w-full px-4 py-3 rounded-lg bg-background text-foreground border border-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                        className="w-full px-4 py-3 rounded-lg bg-background text-foreground border border-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                      className="w-full px-4 py-3 rounded-lg bg-background text-foreground border border-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                      className="w-full px-4 py-3 rounded-lg bg-background text-foreground border border-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>

                  <div className="flex justify-stretch sm:justify-end">
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="gap-2 w-full sm:w-auto"
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
