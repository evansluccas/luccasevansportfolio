import { Briefcase, Coffee, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlobDecoration } from '@/components/decorations/BlobDecoration';
import profilePhoto from '@/assets/profile-photo.jpg';

const stats = [
  { icon: Briefcase, number: '7+', unit: 'years', description: 'Building products' },
  { icon: Coffee, number: '500+', unit: 'cups', description: 'Coffee consumed' },
  { icon: Award, number: '15+', unit: 'projects', description: 'Delivered' },
  { icon: Users, number: '50+', unit: 'teams', description: 'Collaborated' },
];

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Blob Decorations */}
      <BlobDecoration 
        className="top-20 -right-32 opacity-40" 
        size="xl" 
        variant="primary"
      />
      <BlobDecoration 
        className="bottom-20 -left-48 opacity-30" 
        size="lg" 
        variant="secondary"
        animated
      />
      <BlobDecoration 
        className="top-1/3 left-1/4 opacity-20" 
        size="sm" 
        variant="accent"
      />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Hello Tag */}
            <div className="inline-block mb-6">
              <span className="px-4 py-2 rounded-pill bg-primary/20 text-primary text-sm font-medium border border-primary/30">
                Hello! 👋
              </span>
            </div>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4">
              <span className="text-primary">Luccas</span>{' '}
              <span className="text-foreground">Evans</span>
            </h1>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-medium mb-6">
              Product Manager
            </h2>

            {/* Bio */}
            <p className="text-muted-foreground text-base lg:text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Transforming ideas into impactful digital products. Passionate about user experience, 
              data-driven decisions, and building products that make a difference.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" asChild>
                <a href="#projects">View Projects</a>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <a href="#contact">Get in Touch</a>
              </Button>
            </div>
          </div>

          {/* Right Content - Photo */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              {/* Orange Circle Behind */}
              <div className="absolute inset-0 bg-primary rounded-full scale-110 -z-10 opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full scale-105 -z-10 blur-sm" />
              
              {/* Photo Container */}
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-primary/30 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
                <img
                  src={profilePhoto}
                  alt="Luccas Evans - Product Manager"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 lg:mt-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative p-6 rounded-2xl bg-card border border-primary/20 card-diagonal-lines hover-lift group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                    <stat.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-bold text-foreground">
                      {stat.number}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      {stat.unit}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
