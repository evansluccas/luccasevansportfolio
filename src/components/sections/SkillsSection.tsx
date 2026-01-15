import { BlobDecoration } from '@/components/decorations/BlobDecoration';

const skillCategories = [
  {
    title: 'Product Management',
    skills: [
      { name: 'Product Strategy', level: 95 },
      { name: 'Roadmap Planning', level: 90 },
      { name: 'User Research', level: 85 },
      { name: 'A/B Testing', level: 80 },
      { name: 'Go-to-Market', level: 85 },
    ],
  },
  {
    title: 'Technical Skills',
    skills: [
      { name: 'SQL & Analytics', level: 80 },
      { name: 'No-Code Tools', level: 90 },
      { name: 'API Understanding', level: 75 },
      { name: 'Prototyping', level: 85 },
      { name: 'Data Visualization', level: 80 },
    ],
  },
  {
    title: 'Tools & Platforms',
    skills: [
      { name: 'Jira / Asana', level: 95 },
      { name: 'Figma', level: 85 },
      { name: 'Amplitude / Mixpanel', level: 90 },
      { name: 'Notion / Confluence', level: 95 },
      { name: 'Miro / FigJam', level: 90 },
    ],
  },
  {
    title: 'Soft Skills',
    skills: [
      { name: 'Leadership', level: 90 },
      { name: 'Communication', level: 95 },
      { name: 'Problem Solving', level: 90 },
      { name: 'Stakeholder Management', level: 85 },
      { name: 'Team Collaboration', level: 95 },
    ],
  },
];

export function SkillsSection() {
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
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="p-6 lg:p-8 rounded-2xl bg-card border border-primary/20 hover-lift"
            >
              <h3 className="text-xl font-bold text-primary mb-6">
                {category.title}
              </h3>
              <div className="space-y-5">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {skill.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
