import { useSkills, useSectionConfig } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';
import { Reveal } from '@/components/ui/Reveal';


export function SkillsSection() {
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: sectionConfig, isLoading: configLoading } = useSectionConfig('skills');

  // Don't render if section is hidden
  if (!configLoading && sectionConfig && !sectionConfig.is_visible) {
    return null;
  }

  // Don't render if no skills
  if (!skillsLoading && (!skills || skills.length === 0)) {
    return null;
  }

  const isLoading = skillsLoading || configLoading;

  // Group skills by category
  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <section id="skills" className="relative section-padding overflow-hidden bg-background">
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
                {sectionConfig?.title || 'Skills &'}{' '}
                <span className="italic text-accent">{sectionConfig?.title_highlight || 'Technologies'}</span>
              </h2>
              {sectionConfig?.description && (
                <p className="text-muted-foreground text-[0.95rem] sm:text-lg">
                  {sectionConfig.description}
                </p>
              )}
            </>
          )}
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-x-14 gap-y-10 sm:gap-y-12 border-t border-border pt-8 sm:pt-10">
          {skillsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-none" />
            ))
          ) : (
            groupedSkills && Object.entries(groupedSkills).map(([category, categorySkills], i) => (
              <Reveal key={category} immediate={i === 0} delay={i === 0 ? 0 : 0.1}>
                <div>
                  <h3 className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground pb-3 mb-5 sm:mb-6 border-b border-border">
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {categorySkills?.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="text-sm text-foreground">
                            {skill.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="h-px bg-border overflow-hidden">
                          <div
                            className="h-px bg-accent transition-all duration-1000 ease-out"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
