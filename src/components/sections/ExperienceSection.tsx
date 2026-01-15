import { useState, useCallback, useEffect } from 'react';
import { useExperiences, useExperienceStories } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
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
          <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
            About me
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Professional <span className="text-primary">Experience</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A journey of growth, learning, and impactful contributions across different roles and companies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Story Carousel */}
          <div className="flex flex-col">
            {storiesLoading ? (
              <Skeleton className="aspect-[3/4] w-full max-w-md mx-auto rounded-2xl" />
            ) : stories && stories.length > 0 ? (
              <div className="relative max-w-md mx-auto w-full">
                {/* Carousel */}
                <div 
                  ref={emblaRef} 
                  className="overflow-hidden w-full rounded-2xl"
                >
                  <div className="flex">
                    {stories.map((story) => (
                      <div 
                        key={story.id} 
                        className="flex-[0_0_100%] min-w-0"
                      >
                        <div className="relative aspect-[3/4] bg-primary/20 rounded-2xl overflow-hidden">
                          <img
                            src={story.image_url}
                            alt={story.caption}
                            className="w-full h-full object-cover"
                          />
                          {/* Caption Overlay */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="bg-foreground/60 backdrop-blur-md rounded-xl p-4">
                              <p className="text-background text-sm leading-relaxed">
                                {story.caption}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows */}
                {stories.length > 1 && (
                  <>
                    <button
                      onClick={scrollPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-foreground/80 hover:bg-foreground text-background flex items-center justify-center transition-colors z-10"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={scrollNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-foreground/80 hover:bg-foreground text-background flex items-center justify-center transition-colors z-10"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Dots Navigation */}
                <div className="flex gap-2 mt-6 justify-center">
                  {stories.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
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
              <div className="flex items-center justify-center aspect-[3/4] w-full max-w-md mx-auto rounded-2xl bg-card border border-primary/20">
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
                <div className="space-y-0">
                  {experiences?.map((exp, index) => (
                    <div key={exp.id} className="flex gap-6 items-start">
                      {/* Year */}
                      <div className="w-14 flex-shrink-0 text-right pt-4">
                        <span className="text-lg font-semibold text-foreground">
                          {getYear(exp.start_date)}
                        </span>
                      </div>

                      {/* Timeline Connector */}
                      <div className="relative flex-shrink-0 z-10 flex flex-col items-center">
                        {/* Orange ball with dashed border */}
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          {/* Dashed outer ring */}
                          <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/60" />
                          {/* Solid orange inner circle */}
                          <div className="w-8 h-8 rounded-full bg-primary" />
                        </div>
                        {/* Vertical dashed line extending down */}
                        <div className="w-px flex-1 min-h-20 border-l-2 border-dashed border-muted-foreground/40" />
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
