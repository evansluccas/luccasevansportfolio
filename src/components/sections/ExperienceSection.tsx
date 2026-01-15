import { useState, useCallback, useEffect } from 'react';
import { useExperiences, useExperienceStories } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';
import useEmblaCarousel from 'embla-carousel-react';

export function ExperienceSection() {
  const { data: experiences, isLoading: experiencesLoading } = useExperiences();
  const { data: stories, isLoading: storiesLoading } = useExperienceStories();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  }, [emblaApi]);

  const isLoading = experiencesLoading || storiesLoading;

  // Don't render if no experiences
  if (!isLoading && (!experiences || experiences.length === 0)) {
    return null;
  }

  // Extract year from start_date
  const getYear = (dateStr: string) => {
    try {
      return new Date(dateStr).getFullYear().toString();
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="experience" className="relative section-padding overflow-hidden bg-background">
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            About me
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Story Carousel */}
          <div className="flex flex-col">
            {storiesLoading ? (
              <Skeleton className="aspect-square w-full max-w-md mx-auto rounded-2xl" />
            ) : stories && stories.length > 0 ? (
              <div className="flex flex-col items-center">
                {/* Carousel */}
                <div 
                  ref={emblaRef} 
                  className="overflow-hidden w-full max-w-md rounded-2xl"
                >
                  <div className="flex">
                    {stories.map((story) => (
                      <div 
                        key={story.id} 
                        className="flex-[0_0_100%] min-w-0"
                      >
                        <div className="relative aspect-square bg-primary/20 rounded-2xl overflow-hidden">
                          <img
                            src={story.image_url}
                            alt={story.caption}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Caption */}
                {stories[selectedIndex] && (
                  <p className="mt-4 text-muted-foreground text-center max-w-md">
                    {stories[selectedIndex].caption}
                  </p>
                )}

                {/* Dots Navigation */}
                <div className="flex gap-2 mt-6">
                  {stories.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === selectedIndex 
                          ? 'bg-primary' 
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center aspect-square w-full max-w-md mx-auto rounded-2xl bg-card border border-primary/20">
                <p className="text-muted-foreground text-center px-8">
                  Add stories in the admin panel to display your journey here.
                </p>
              </div>
            )}
          </div>

          {/* Right Side - Timeline */}
          <div className="relative">
            {experiencesLoading ? (
              <div className="space-y-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-6">
                    <Skeleton className="w-16 h-6" />
                    <Skeleton className="w-4 h-4 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative">
                {/* Vertical dashed line */}
                <div 
                  className="absolute left-[4.5rem] top-2 bottom-2 w-px border-l-2 border-dashed border-muted-foreground/30"
                  style={{ marginLeft: '0.5rem' }}
                />

                <div className="space-y-8">
                  {experiences?.map((exp) => (
                    <div key={exp.id} className="flex gap-6 items-start">
                      {/* Year */}
                      <div className="w-14 flex-shrink-0 text-right">
                        <span className="text-lg font-semibold text-foreground">
                          {getYear(exp.start_date)}
                        </span>
                      </div>

                      {/* Dot */}
                      <div className="relative flex-shrink-0 z-10">
                        <div className="w-4 h-4 rounded-full bg-primary border-4 border-background" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <h3 className="text-lg font-bold text-foreground">
                          {exp.position}
                        </h3>
                        <h4 className="text-base text-primary font-medium mb-2">
                          @{exp.company}
                        </h4>
                        {exp.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
