import { useState, useCallback, useEffect, useRef } from 'react';
import { useExperiences, useExperienceStories, useSectionConfig } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TWEEN_FACTOR = 1.2;

export function ExperienceSection() {
  const { data: experiences, isLoading: experiencesLoading } = useExperiences();
  const { data: stories, isLoading: storiesLoading } = useExperienceStories();
  const { data: sectionConfig, isLoading: configLoading } = useSectionConfig('experience');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const setTweenNodes = useCallback((emblaApi: ReturnType<typeof useEmblaCarousel>[1]) => {
    if (!emblaApi) return;
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.story-slide') as HTMLElement;
    });
  }, []);

  const tweenRotate = useCallback((emblaApi: ReturnType<typeof useEmblaCarousel>[1]) => {
    if (!emblaApi) return;
    
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    
    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      
      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (snapIndex === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }
      
      const tweenValue = diffToTarget * (-1 * TWEEN_FACTOR);
      const rotateY = tweenValue * 45; // Max 45 degrees rotation
      const scale = 1 - Math.abs(tweenValue) * 0.15;
      const opacity = 1 - Math.abs(tweenValue) * 0.5;
      
      const tweenNode = tweenNodes.current[snapIndex];
      if (tweenNode) {
        tweenNode.style.transform = `perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`;
        tweenNode.style.opacity = `${opacity}`;
      }
    });
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    setTweenNodes(emblaApi);
    tweenRotate(emblaApi);
    
    emblaApi.on('reInit', setTweenNodes);
    emblaApi.on('reInit', tweenRotate);
    emblaApi.on('scroll', tweenRotate);
    emblaApi.on('select', onSelect);
    
    onSelect();
    
    return () => {
      emblaApi.off('reInit', setTweenNodes);
      emblaApi.off('reInit', tweenRotate);
      emblaApi.off('scroll', tweenRotate);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect, setTweenNodes, tweenRotate]);

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

  const isLoading = experiencesLoading || storiesLoading || configLoading;

  // Don't render if section is hidden
  if (!configLoading && sectionConfig && !sectionConfig.is_visible) {
    return null;
  }

  // Don't render if no experiences
  if (!isLoading && (!experiences || experiences.length === 0)) {
    return null;
  }


  return (
    <section id="experience" className="relative section-padding overflow-hidden bg-background">
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
                <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
                  {sectionConfig.tag}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {sectionConfig?.title || 'Professional'}{' '}
                <span className="text-primary">{sectionConfig?.title_highlight || 'Experience'}</span>
              </h2>
              {sectionConfig?.description && (
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  {sectionConfig.description}
                </p>
              )}
            </>
          )}
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
                        <div 
                          className="story-slide relative aspect-[3/4] bg-primary/20 rounded-2xl overflow-hidden transition-[opacity] duration-200"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <img
                            src={story.image_url}
                            alt={story.caption}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Mobile Tap Zones (Instagram-style) */}
                          {stories.length > 1 && (
                            <div className="absolute inset-0 flex lg:hidden">
                              <button 
                                onClick={scrollPrev}
                                className="w-1/2 h-full cursor-pointer"
                                aria-label="Previous slide"
                              />
                              <button 
                                onClick={scrollNext}
                                className="w-1/2 h-full cursor-pointer"
                                aria-label="Next slide"
                              />
                            </div>
                          )}
                          
                          {/* Caption Overlay - Apple Glassmorphism (Orange) */}
                          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                            <div 
                              className="rounded-2xl p-4"
                              style={{
                                background: 'linear-gradient(135deg, hsla(16, 100%, 65%, 0.25), hsla(16, 100%, 80%, 0.15))',
                                backdropFilter: 'blur(50px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(50px) saturate(180%)',
                                border: '1px solid hsla(16, 100%, 70%, 0.35)',
                                boxShadow: 'inset 0 1px 1px hsla(16, 100%, 80%, 0.3), 0 8px 32px rgba(0, 0, 0, 0.15)',
                              }}
                            >
                              <p className="text-white text-sm leading-relaxed font-medium drop-shadow-sm">
                                {story.caption}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows (Desktop only) - Apple Glassmorphism (Orange) */}
                {stories.length > 1 && (
                  <>
                    <button
                      onClick={scrollPrev}
                      className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full items-center justify-center transition-all z-10 hover:scale-105 active:scale-95"
                      style={{
                        background: 'linear-gradient(135deg, hsla(16, 100%, 65%, 0.25), hsla(16, 100%, 80%, 0.15))',
                        backdropFilter: 'blur(50px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(50px) saturate(180%)',
                        border: '1px solid hsla(16, 100%, 70%, 0.35)',
                        boxShadow: 'inset 0 1px 1px hsla(16, 100%, 80%, 0.3), 0 8px 32px rgba(0, 0, 0, 0.15)',
                      }}
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-5 h-5 text-white drop-shadow-sm" />
                    </button>
                    <button
                      onClick={scrollNext}
                      className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full items-center justify-center transition-all z-10 hover:scale-105 active:scale-95"
                      style={{
                        background: 'linear-gradient(135deg, hsla(16, 100%, 65%, 0.25), hsla(16, 100%, 80%, 0.15))',
                        backdropFilter: 'blur(50px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(50px) saturate(180%)',
                        border: '1px solid hsla(16, 100%, 70%, 0.35)',
                        boxShadow: 'inset 0 1px 1px hsla(16, 100%, 80%, 0.3), 0 8px 32px rgba(0, 0, 0, 0.15)',
                      }}
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-5 h-5 text-white drop-shadow-sm" />
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
                          {exp.year || '—'}
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
