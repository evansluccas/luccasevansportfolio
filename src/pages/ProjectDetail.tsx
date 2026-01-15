import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlobDecoration } from '@/components/decorations/BlobDecoration';

const projectsData: Record<string, {
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  gallery: string[];
  technologies: string[];
  category: string;
  completionDate: string;
  demoLink?: string;
  repoLink?: string;
  results: string[];
}> = {
  'fintech-dashboard': {
    title: 'Fintech Dashboard',
    description: 'A comprehensive financial management platform for SMBs with real-time analytics and automated reporting.',
    fullDescription: `The Fintech Dashboard project was born from a deep understanding of the challenges small and medium businesses face in managing their finances. As the lead Product Manager, I guided this project from initial concept through to successful launch.

Our goal was to create an intuitive platform that would democratize access to enterprise-level financial analytics. We conducted extensive user research with over 50 SMB owners to understand their pain points and needs.

The result is a platform that processes real-time transaction data, provides automated financial reports, and offers actionable insights that help businesses make better decisions.`,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Chart.js', 'Redis', 'AWS'],
    category: 'Web',
    completionDate: 'December 2023',
    demoLink: 'https://example.com/demo',
    repoLink: 'https://github.com/example',
    results: [
      '40% increase in user engagement',
      '10,000+ active enterprise clients',
      '99.9% uptime achieved',
      '$2M+ in processed transactions daily',
    ],
  },
  'ecommerce-mobile': {
    title: 'E-Commerce Mobile App',
    description: 'Native mobile shopping experience with personalized recommendations and seamless checkout.',
    fullDescription: `This mobile e-commerce application was designed to revolutionize the way users shop on their phones. Leading the product strategy, we focused on creating a frictionless shopping experience.

Key innovations included ML-powered personalized recommendations, one-tap checkout, and real-time inventory syncing. We achieved a 4.8 star rating on both app stores.`,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    ],
    technologies: ['React Native', 'Firebase', 'Stripe', 'TensorFlow Lite'],
    category: 'Mobile',
    completionDate: 'August 2023',
    demoLink: 'https://example.com/app',
    results: [
      '500K+ downloads in first month',
      '35% higher conversion than web',
      '4.8 star rating on app stores',
    ],
  },
  'saas-analytics': {
    title: 'SaaS Analytics Platform',
    description: 'Enterprise-grade analytics solution processing millions of events daily with custom dashboards.',
    fullDescription: `Built for scale, this analytics platform handles over 10 million events per day while providing real-time insights to enterprise clients. I led the product vision and roadmap.

The platform features custom dashboard builders, automated alerting, and deep integration capabilities with popular business tools.`,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    ],
    technologies: ['Vue.js', 'Python', 'AWS', 'Elasticsearch', 'Kafka'],
    category: 'Web',
    completionDate: 'May 2023',
    results: [
      '10M+ events processed daily',
      '50+ enterprise clients',
      '99.99% data accuracy',
    ],
  },
  'healthcare-portal': {
    title: 'Healthcare Patient Portal',
    description: 'HIPAA-compliant patient engagement platform with telemedicine and appointment scheduling.',
    fullDescription: `Developed during the healthcare digital transformation wave, this portal enables patients to manage their healthcare journey entirely online.

Features include secure video consultations, prescription management, and health record access—all while maintaining strict HIPAA compliance.`,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=600&fit=crop',
    gallery: [],
    technologies: ['Next.js', 'GraphQL', 'Twilio', 'MongoDB', 'AWS HIPAA'],
    category: 'Web',
    completionDate: 'February 2023',
    results: [
      '100K+ registered patients',
      '50% reduction in no-shows',
      'Full HIPAA compliance',
    ],
  },
  'ai-content-tool': {
    title: 'AI Content Generator',
    description: 'ML-powered content creation tool that helps marketers generate engaging copy at scale.',
    fullDescription: `Leveraging the latest in AI technology, this tool empowers marketing teams to create high-quality content faster than ever before.

The platform uses fine-tuned language models to generate copy that matches brand voice and tone, dramatically reducing content production time.`,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
    gallery: [],
    technologies: ['Python', 'OpenAI', 'FastAPI', 'Redis', 'React'],
    category: 'Product',
    completionDate: 'October 2023',
    results: [
      '80% faster content creation',
      '10K+ pieces generated monthly',
      '95% user satisfaction',
    ],
  },
};

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectsData[slug] : null;

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero */}
        <section className="relative">
          <div className="aspect-[21/9] w-full overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

          <BlobDecoration 
            className="-right-48 top-1/4 opacity-20" 
            size="xl" 
            variant="primary"
          />
        </section>

        {/* Content */}
        <section className="section-container relative z-10 -mt-32 pb-24">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Projects</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {project.category}
              </span>
              <span className="px-4 py-1 rounded-full bg-muted text-muted-foreground text-sm flex items-center gap-2">
                <Calendar size={14} />
                {project.completionDate}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              {project.title}
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl">
              {project.description}
            </p>

            {/* Action Buttons */}
            {(project.demoLink || project.repoLink) && (
              <div className="flex flex-wrap gap-4 mt-8">
                {project.demoLink && (
                  <Button variant="hero" size="lg" asChild>
                    <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={18} className="mr-2" />
                      View Demo
                    </a>
                  </Button>
                )}
                {project.repoLink && (
                  <Button variant="heroOutline" size="lg" asChild>
                    <a href={project.repoLink} target="_blank" rel="noopener noreferrer">
                      <Github size={18} className="mr-2" />
                      View Code
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Technologies */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4 flex items-center gap-2">
              <Tag size={18} />
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-lg bg-card border border-primary/20 text-foreground font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Full Description */}
          <div className="prose prose-invert max-w-none mb-12">
            <h2 className="text-2xl font-bold mb-6 text-foreground">About This Project</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {project.fullDescription}
            </div>
          </div>

          {/* Results */}
          {project.results.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Key Results</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {project.results.map((result, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-card border border-primary/20 text-center"
                  >
                    <p className="text-foreground font-medium">{result}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {project.gallery.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Gallery</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-xl overflow-hidden border border-primary/20"
                  >
                    <img
                      src={image}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
