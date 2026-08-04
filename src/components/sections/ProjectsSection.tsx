import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { useProjects, useSectionConfig, type Project } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectCover } from '@/components/projects/ProjectCover';
import { Reveal } from '@/components/ui/Reveal';


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
    <dl className="space-y-3 sm:space-y-3.5">
      {entries.map(({ key, label }) => (
        <div key={key} className="grid grid-cols-1 sm:grid-cols-[4.5rem_1fr] gap-1 sm:gap-2.5">
          <dt className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground sm:pt-0.5">
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
    <section id="projects" className="relative section-padding overflow-hidden">
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          {configLoading ? (
            <>
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-10 w-56 mb-5" />
              <Skeleton className="h-5 w-80" />
            </>
          ) : (
            <>
              {sectionConfig?.tag && (
                <span className="inline-block text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  {sectionConfig.tag}
                </span>
              )}
              <h2 className="text-[1.8rem] leading-tight sm:text-3xl lg:text-4xl mb-3 sm:mb-4">
                {sectionConfig?.title || 'Featured'}{' '}
                <span className="italic text-accent">{sectionConfig?.title_highlight || 'Projects'}</span>
              </h2>
              {sectionConfig?.description && (
                <p className="text-muted-foreground text-[0.9rem] sm:text-base">
                  {sectionConfig.description}
                </p>
              )}
            </>
          )}
        </div>

        {/* Carousel */}
        {projectsLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <div ref={emblaRef} className="overflow-hidden -mx-2">
              <div className="flex items-start lg:items-stretch">
                {projects?.map((project, i) => (
                  <Reveal
                    key={project.id}
                    as="article"
                    immediate={i === 0}
                    delay={i === 0 ? 0 : 0.1}
                    className="flex-[0_0_92%] sm:flex-[0_0_60%] lg:flex-[0_0_33.333%] xl:flex-[0_0_32%] min-w-0 px-2"
                  >
                    <div className="h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300">
                      <div className="aspect-[16/9] sm:aspect-[16/8] overflow-hidden border-b border-border">
                        <ProjectCover
                          heading={project.cover_heading || project.title}
                          subheading={project.cover_subheading}
                          category={project.category}
                        />
                      </div>

                      <div className="flex flex-col flex-1 p-4 sm:p-5">
                        <StarBlocks project={project} />

                        <div className="mt-auto pt-4 sm:pt-5">
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {project.technologies.map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-sm bg-secondary/40 text-[0.7rem] text-secondary-foreground"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                          {project.show_details !== false && (
                            <Link
                              to={`/project/${project.slug}`}
                              className="group inline-flex items-center min-h-[44px] text-sm font-medium text-primary hover:text-accent transition-colors"
                            >
                              <span className="border-b border-primary/40 group-hover:border-accent pb-0.5">View details</span>
                              <ArrowRight
                                size={14}
                                className="ml-2 transition-transform group-hover:translate-x-1"
                              />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Controls */}
            {snapCount > 1 && (
              <div className="flex items-center justify-between gap-4 mt-5 sm:mt-6">
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: snapCount }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => emblaApi?.scrollTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-1 rounded-full transition-all ${
                        i === selectedIndex ? 'w-6 bg-primary' : 'w-2.5 bg-primary/25 hover:bg-primary/40'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => emblaApi?.scrollPrev()}
                    disabled={!canPrev}
                    aria-label="Previous projects"
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground transition-colors hover:bg-secondary/40 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => emblaApi?.scrollNext()}
                    disabled={!canNext}
                    aria-label="Next projects"
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground transition-colors hover:bg-secondary/40 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronRight size={16} />
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
