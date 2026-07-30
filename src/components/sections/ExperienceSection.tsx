import { useExperiences, useSectionConfig } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';

export function ExperienceSection() {
  const { data: experiences, isLoading: experiencesLoading } = useExperiences();
  const { data: sectionConfig, isLoading: configLoading } = useSectionConfig('experience');

  const isLoading = experiencesLoading || configLoading;

  // Don't render if section is hidden
  if (!configLoading && sectionConfig && !sectionConfig.is_visible) {
    return null;
  }

  // Don't render if no experiences
  if (!isLoading && (!experiences || experiences.length === 0)) {
    return null;
  }


  return (
    <section id="experience" className="relative section-padding overflow-hidden bg-background">
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-14">
          {configLoading ? (
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
                {sectionConfig?.title || 'Professional'}{' '}
                <span className="italic text-accent">{sectionConfig?.title_highlight || 'Experience'}</span>
              </h2>
              {sectionConfig?.description && (
                <p className="text-muted-foreground text-[0.95rem] sm:text-lg">
                  {sectionConfig.description}
                </p>
              )}
            </>
          )}
        </div>

        {/* Timeline */}
        {experiencesLoading ? (
          <div className="space-y-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid md:grid-cols-[8rem_1fr] gap-6">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ol className="border-t border-border">
            {experiences?.map((exp) => (
              <li
                key={exp.id}
                className="group grid md:grid-cols-[9rem_1fr] gap-1.5 md:gap-10 py-6 sm:py-8 border-b border-border transition-colors hover:bg-secondary/15"
              >
                <div className="md:text-right">
                  <span className="text-xs sm:text-sm font-medium tracking-[0.08em] text-muted-foreground">
                    {exp.year || '—'}
                  </span>
                </div>

                <div className="relative md:pl-8 md:border-l md:border-border">
                  <span className="hidden md:block absolute -left-[4.5px] top-2 w-2 h-2 rounded-full bg-primary/40 transition-colors group-hover:bg-primary" />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 mb-2">
                    <h3 className="text-lg sm:text-xl text-foreground">{exp.position}</h3>
                    <span className="text-sm text-accent">{exp.company}</span>
                    {exp.employment_type && (
                      <span className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                        {exp.employment_type}
                      </span>
                    )}
                  </div>
                  {exp.location && (
                    <p className="text-xs text-muted-foreground mb-3">{exp.location}</p>
                  )}
                  {exp.description && (
                    <p className="text-muted-foreground text-[0.9rem] sm:text-sm leading-relaxed max-w-2xl">
                      {exp.description}
                    </p>
                  )}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {exp.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-sm bg-secondary/40 text-xs text-secondary-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
