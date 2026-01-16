import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlobDecoration } from '@/components/decorations/BlobDecoration';
import { useProject } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24">
          <Skeleton className="w-full h-96" />
          <div className="section-container py-12">
            <Skeleton className="h-12 w-96 mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mb-8" />
            <Skeleton className="h-48 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">This project doesn't exist or has been unpublished.</p>
          <Button asChild>
            <Link to="/#projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMMM yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero */}
        <section className="relative">
          <div className="aspect-[21/9] w-full overflow-hidden">
            {project.cover_image_url ? (
              <img
                src={project.cover_image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-8xl text-muted-foreground">{project.title.charAt(0)}</span>
              </div>
            )}
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
              {project.completion_date && (
                <span className="px-4 py-1 rounded-full bg-muted text-muted-foreground text-sm flex items-center gap-2">
                  <Calendar size={14} />
                  {formatDate(project.completion_date)}
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              {project.title}
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl">
              {project.short_description}
            </p>

            {/* Action Buttons */}
            {(project.demo_link || project.repo_link) && (
              <div className="flex flex-wrap gap-4 mt-8">
                {project.demo_link && (
                  <Button variant="hero" size="lg" asChild>
                    <a href={project.demo_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={18} className="mr-2" />
                      View Demo
                    </a>
                  </Button>
                )}
                {project.repo_link && (
                  <Button variant="heroOutline" size="lg" asChild>
                    <a href={project.repo_link} target="_blank" rel="noopener noreferrer">
                      <Github size={18} className="mr-2" />
                      View Code
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
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
          )}

          {/* Full Description */}
          {project.full_description && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground">About This Project</h2>
              <div 
                className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-a:hover:text-primary/80 prose-strong:text-foreground prose-li:text-muted-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-primary/50 prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-img:rounded-lg prose-img:my-4"
                dangerouslySetInnerHTML={{ __html: project.full_description }}
              />
            </div>
          )}

          {/* Results */}
          {project.results && project.results.length > 0 && (
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
          {project.gallery && project.gallery.length > 0 && (
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
