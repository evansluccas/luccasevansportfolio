import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { useProjects, useSectionConfig, type Project } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';

const STAR_LABELS = [
  { key: 'star_situation', label: 'Situation' },
  { key: 'star_task', label: 'Task' },
  { key: 'star_action', label: 'Action' },
  { key: 'star_result', label: 'Result' },
] as const;

function StarBlocks({ project }: { project: Project }) {
  const entries = STAR_LABELS.filter(({ key }) => !!project[key]);
  if (entries.length === 0) return null;

  return (
    <dl className="space-y-4 border-t border-border pt-5">
      {entries.map(({ key, label }) => (
        <div key={key} className="grid grid-cols-[5.5rem_1fr] gap-3">
          <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground pt-0.5">
            {label}
          </dt>
          <dd className="text-sm leading-relaxed text-foreground/80">{project[key]}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProjectsSection() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: sectionConfig, isLoading: configLoading } = useSectionConfig('projects');
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setSnapCount(emblaApi.scrollSnapList().length);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

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
    <section id="projects" className="relative section-padding overflow-hidden bg-muted/40">
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
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
              <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5">
                {sectionConfig?.title || 'Featured'}{' '}
                <span className="italic text-accent">{sectionConfig?.title_highlight || 'Projects'}</span>
              </h2>
              {sectionConfig?.description && (
                <p className="text-muted-foreground text-lg">
                  {sectionConfig.description}
                </p>
              )}
            </>
          )}
        </div>

        {/* Carousel */}
        {projectsLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <div ref={emblaRef} className="overflow-hidden -mx-2">
              <div className="flex">
                {projects?.map((project) => (
                  <article
                    key={project.id}
                    className="flex-[0_0_100%] sm:flex-[0_0_70%] lg:flex-[0_0_46%] min-w-0 px-2"
                  >
                    <div className="h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden shadow-card">
                      {project.cover_image_url && (
                        <div className="aspect-[16/7] overflow-hidden border-b border-border">
                          <img
                            src={project.cover_image_url}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex flex-col flex-1 p-7">
                        {project.category && (
                          <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground mb-3">
                            {project.category}
                          </span>
                        )}
                        <h3 className="text-2xl mb-3">{project.title}</h3>
                        {project.short_description && (
                          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                            {project.short_description}
                          </p>
                        )}

                        <StarBlocks project={project} />

                        <div className="mt-auto pt-6">
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                              {project.technologies.map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 rounded-sm bg-secondary/40 text-xs text-secondary-foreground"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                          {project.show_details !== false && (
                            <Link
                              to={`/project/${project.slug}`}
                              className="group inline-flex items-center text-sm font-medium text-primary border-b border-primary/40 pb-0.5 hover:border-primary transition-colors"
                            >
                              View details
                              <ArrowRight
                                size={15}
                                className="ml-2 transition-transform group-hover:translate-x-1"
                              />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Controls */}
            {snapCount > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="flex gap-1.5">
                  {Array.from({ length: snapCount }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => emblaApi?.scrollTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-1 rounded-full transition-all ${
                        i === selectedIndex ? 'w-8 bg-primary' : 'w-4 bg-primary/25 hover:bg-primary/40'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => emblaApi?.scrollPrev()}
                    disabled={!canPrev}
                    aria-label="Previous projects"
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground transition-colors hover:bg-secondary/40 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => emblaApi?.scrollNext()}
                    disabled={!canNext}
                    aria-label="Next projects"
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground transition-colors hover:bg-secondary/40 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
