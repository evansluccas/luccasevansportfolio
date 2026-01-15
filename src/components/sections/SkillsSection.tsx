import { BlobDecoration } from '@/components/decorations/BlobDecoration';
import { useSkills } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';

export function SkillsSection() {
  const { data: skills, isLoading } = useSkills();

  // Don't render if no skills
  if (!isLoading && (!skills || skills.length === 0)) {
    return null;
  }

  // Group skills by category
  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <section id="skills" className="relative section-padding overflow-hidden">
      <BlobDecoration 
        className="-right-32 bottom-1/4 opacity-20" 
        size="lg" 
        variant="primary"
      />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-pill bg-primary/10 text-primary text-sm font-medium mb-4">
            Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Skills & <span className="text-primary">Competencies</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A blend of technical knowledge, business acumen, and interpersonal skills 
            that drive product success.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))
          ) : (
            groupedSkills && Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div
                key={category}
                className="p-6 lg:p-8 rounded-2xl bg-card border border-primary/20 hover-lift"
              >
                <h3 className="text-xl font-bold text-primary mb-6">
                  {category}
                </h3>
                <div className="space-y-5">
                  {categorySkills?.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {skill.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
