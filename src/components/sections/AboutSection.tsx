import { MessageSquare, Lightbulb, Code2, Users, Target, Zap } from 'lucide-react';
import { BlobDecoration } from '@/components/decorations/BlobDecoration';

const characteristics = [
  {
    icon: MessageSquare,
    title: 'Strategic Communication',
    description: 'Expert at aligning stakeholders, translating complex ideas into actionable strategies.',
  },
  {
    icon: Lightbulb,
    title: 'Product Vision',
    description: 'Creating roadmaps that balance user needs with business goals and technical feasibility.',
  },
  {
    icon: Code2,
    title: 'Technical Fluency',
    description: 'Deep understanding of development processes and no-code tools to accelerate delivery.',
  },
  {
    icon: Users,
    title: 'Cross-functional Leadership',
    description: 'Building and leading diverse teams to deliver exceptional products together.',
  },
  {
    icon: Target,
    title: 'Data-Driven Decisions',
    description: 'Leveraging analytics and user research to validate hypotheses and drive improvements.',
  },
  {
    icon: Zap,
    title: 'Agile Mindset',
    description: 'Embracing iteration, continuous learning, and rapid experimentation.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative section-padding overflow-hidden">
      <BlobDecoration 
        className="-right-32 top-1/4 opacity-20" 
        size="lg" 
        variant="accent"
      />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-pill bg-primary/10 text-primary text-sm font-medium mb-4">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            What I <span className="text-primary">Bring</span> to the Table
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            With over 7 years of experience in product management, I combine strategic thinking 
            with hands-on execution to deliver products that users love.
          </p>
        </div>

        {/* Characteristics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {characteristics.map((char, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-card border border-primary/20 hover-lift group transition-all duration-300"
            >
              <div className="p-4 rounded-xl bg-primary/20 w-fit mb-6 group-hover:bg-primary/30 transition-colors">
                <char.icon size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {char.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {char.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
