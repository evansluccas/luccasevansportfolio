import { ArrowRight } from 'lucide-react';
import { BlobDecoration } from '@/components/decorations/BlobDecoration';
import { Link } from 'react-router-dom';
import { useProjects, useSectionConfig } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';

export function ProjectsSection() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: sectionConfig, isLoading: configLoading } = useSectionConfig('projects');

  // Don't render if section is hidden
  if (!configLoading && sectionConfig && !sectionConfig.is_visible) {
    return null;
  }

  // Don't render if no projects
  if (!projectsLoading && (!projects || projects.length === 0)) {
    return null;
  }

  const isLoading = projectsLoading || configLoading;

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
          {configLoading ? (
            <>
              <Skeleton className="h-8 w-32 mx-auto mb-4" />
              <Skeleton className="h-12 w-64 mx-auto mb-6" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </>
          ) : (
            <>
              {sectionConfig?.tag && (
                <span className="inline-block px-4 py-2 rounded-pill bg-primary/10 text-primary text-sm font-medium mb-4">
                  {sectionConfig.tag}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                {sectionConfig?.title || 'Featured'}{' '}
                <span className="text-primary">{sectionConfig?.title_highlight || 'Projects'}</span>
              </h2>
              {sectionConfig?.description && (
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  {sectionConfig.description}
                </p>
              )}
            </>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))
          ) : (
            projects?.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.slug}`}
                className="group relative rounded-2xl bg-card border border-primary/20 overflow-hidden hover-lift"
              >
                {/* Image */}
                <div className="aspect-video overflow-hidden relative">
                  {project.cover_image_url ? (
                    <img
                      src={project.cover_image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-4xl text-muted-foreground">{project.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                    {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.short_description}
                  </p>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
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
                  )}

                  {/* View More */}
                  <div className="flex items-center text-primary text-sm font-medium">
                    <span>View Details</span>
                    <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
