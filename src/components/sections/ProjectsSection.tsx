import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlobDecoration } from '@/components/decorations/BlobDecoration';
import { Link } from 'react-router-dom';

const projects = [
  {
    slug: 'fintech-dashboard',
    title: 'Fintech Dashboard',
    description: 'A comprehensive financial management platform for SMBs with real-time analytics and automated reporting.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Chart.js'],
    category: 'Web',
    featured: true,
  },
  {
    slug: 'ecommerce-mobile',
    title: 'E-Commerce Mobile App',
    description: 'Native mobile shopping experience with personalized recommendations and seamless checkout.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    technologies: ['React Native', 'Firebase', 'Stripe'],
    category: 'Mobile',
    featured: true,
  },
  {
    slug: 'saas-analytics',
    title: 'SaaS Analytics Platform',
    description: 'Enterprise-grade analytics solution processing millions of events daily with custom dashboards.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    technologies: ['Vue.js', 'Python', 'AWS', 'Elasticsearch'],
    category: 'Web',
    featured: true,
  },
  {
    slug: 'healthcare-portal',
    title: 'Healthcare Patient Portal',
    description: 'HIPAA-compliant patient engagement platform with telemedicine and appointment scheduling.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
    technologies: ['Next.js', 'GraphQL', 'Twilio', 'MongoDB'],
    category: 'Web',
    featured: false,
  },
  {
    slug: 'ai-content-tool',
    title: 'AI Content Generator',
    description: 'ML-powered content creation tool that helps marketers generate engaging copy at scale.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    technologies: ['Python', 'OpenAI', 'FastAPI', 'Redis'],
    category: 'Product',
    featured: false,
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="relative section-padding overflow-hidden">
      <BlobDecoration 
        className="-left-32 top-1/4 opacity-15" 
        size="xl" 
        variant="accent"
      />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-pill bg-primary/10 text-primary text-sm font-medium mb-4">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A selection of products I've helped build, from concept to launch.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link
              key={index}
              to={`/project/${project.slug}`}
              className="group relative rounded-2xl bg-card border border-primary/20 overflow-hidden hover-lift"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Category Badge */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                  {project.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* View More */}
                <div className="flex items-center text-primary text-sm font-medium">
                  <span>View Details</span>
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
