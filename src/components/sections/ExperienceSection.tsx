import { MapPin, Calendar } from 'lucide-react';
import { BlobDecoration } from '@/components/decorations/BlobDecoration';
import { useExperiences } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export function ExperienceSection() {
  const { data: experiences, isLoading } = useExperiences();

  // Don't render if no experiences
  if (!isLoading && (!experiences || experiences.length === 0)) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="experience" className="relative section-padding overflow-hidden">
      <BlobDecoration 
        className="-left-48 top-1/3 opacity-15" 
        size="xl" 
        variant="secondary"
      />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-pill bg-primary/10 text-primary text-sm font-medium mb-4">
            Career Journey
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Professional <span className="text-primary">Experience</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A track record of building impactful products across different industries and scales.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />

          {/* Experience Items */}
          <div className="space-y-12">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="relative flex flex-col md:flex-row gap-8">
                  <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />
                  <div className="md:w-1/2 pl-8 md:pl-0 md:pr-16">
                    <Skeleton className="h-48 rounded-2xl" />
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))
            ) : (
              experiences?.map((exp, index) => (
                <div
                  key={exp.id}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />

                  {/* Content */}
                  <div className={`md:w-1/2 pl-8 md:pl-0 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                    <div className="p-6 rounded-2xl bg-card border border-primary/20 hover-lift">
                      {/* Type Badge */}
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                        exp.employment_type === 'Freelance' 
                          ? 'bg-coral/20 text-coral' 
                          : 'bg-primary/20 text-primary'
                      }`}>
                        {exp.employment_type}
                      </span>

                      {/* Position & Company */}
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {exp.position}
                      </h3>
                      <h4 className="text-lg text-primary font-medium mb-3">
                        {exp.company}
                      </h4>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {exp.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                        </span>
                      </div>

                      {/* Description */}
                      {exp.description && (
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {exp.description}
                        </p>
                      )}

                      {/* Technologies */}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
