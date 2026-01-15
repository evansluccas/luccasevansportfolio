import { Linkedin, Mail, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlobDecoration } from '@/components/decorations/BlobDecoration';
import { useSiteConfig } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';

export function ContactSection() {
  const { data: config, isLoading } = useSiteConfig();

  const contactInfo = [
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: config?.social_linkedin ? config.social_linkedin.replace('https://linkedin.com/in/', '') : null,
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
          <span className="inline-block px-4 py-2 rounded-pill bg-primary/10 text-primary text-sm font-medium mb-4">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Contact <span className="text-primary">Me</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a project in mind or want to discuss opportunities? Let's connect!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-8">
              Let's <span className="text-primary">Talk</span>
            </h3>

            {isLoading ? (
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
                  <div className="p-3 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                    <info.icon size={24} className="text-primary" />
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
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your name"
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
                    placeholder="your@email.com"
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
                  placeholder="What's this about?"
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
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 rounded-lg bg-input text-background border border-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button variant="hero" size="lg" className="gap-2">
                  <Send size={18} />
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
