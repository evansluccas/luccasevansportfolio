import { MapPin, Calendar } from 'lucide-react';
import { BlobDecoration } from '@/components/decorations/BlobDecoration';

const experiences = [
  {
    position: 'Senior Product Manager',
    company: 'TechCorp Inc.',
    location: 'São Paulo, Brazil',
    period: '2022 - Present',
    description: 'Leading product strategy for a B2B SaaS platform serving 10K+ enterprise clients. Drove 40% increase in user engagement through data-driven feature prioritization.',
    technologies: ['Jira', 'Amplitude', 'Figma', 'SQL', 'Metabase'],
    type: 'Full-time',
  },
  {
    position: 'Product Manager',
    company: 'StartupX',
    location: 'Remote',
    period: '2020 - 2022',
    description: 'Built and scaled a marketplace product from 0 to 100K users. Managed cross-functional team of 12 engineers and designers.',
    technologies: ['Notion', 'Mixpanel', 'Miro', 'Google Analytics'],
    type: 'Full-time',
  },
  {
    position: 'Associate Product Manager',
    company: 'InnovateLab',
    location: 'Rio de Janeiro, Brazil',
    period: '2018 - 2020',
    description: 'Contributed to the development of mobile fintech solutions. Implemented user research programs that improved NPS by 25 points.',
    technologies: ['Trello', 'Hotjar', 'Sketch', 'Firebase'],
    type: 'Full-time',
  },
  {
    position: 'Product Consultant',
    company: 'Freelance',
    location: 'Remote',
    period: '2017 - 2018',
    description: 'Provided product strategy consulting for early-stage startups. Helped 5+ companies define MVPs and go-to-market strategies.',
    technologies: ['Lean Canvas', 'User Interviews', 'Prototyping'],
    type: 'Freelance',
  },
];

export function ExperienceSection() {
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
            {experiences.map((exp, index) => (
              <div
                key={index}
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
                      exp.type === 'Freelance' 
                        ? 'bg-coral/20 text-coral' 
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {exp.type}
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
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {exp.period}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Technologies */}
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
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
