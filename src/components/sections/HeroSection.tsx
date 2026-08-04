import { Button } from '@/components/ui/button';
import { useSiteConfig, useHeroStats } from '@/hooks/usePortfolioData';
import { getIcon } from '@/lib/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { CountUp } from '@/components/ui/count-up';

export function HeroSection() {
  const { data: config, isLoading: configLoading } = useSiteConfig();
  const { data: stats, isLoading: statsLoading } = useHeroStats();

  const isLoading = configLoading || statsLoading;


  return (
    <section id="home" className="relative lg:min-h-screen flex items-center pt-24 sm:pt-28 pb-14 sm:pb-16 overflow-hidden bg-background">
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1 text-left">
            {/* Name */}
            {isLoading ? (
              <Skeleton className="h-16 w-80 mb-4" />
            ) : (
              <h1 className="text-[2.6rem] leading-[1.05] sm:text-5xl lg:text-6xl xl:text-7xl mb-4 sm:mb-5">
                <span className="text-foreground">{config?.name?.split(' ')[0]}</span>{' '}
                <span className="italic text-accent">{config?.name?.split(' ').slice(1).join(' ')}</span>
              </h1>
            )}

            {/* Subtitle */}
            {isLoading ? (
              <Skeleton className="h-8 w-72 mb-6" />
            ) : (config?.hero_subtitle || config?.title) && (
              <h2 className="text-base sm:text-xl lg:text-2xl text-foreground font-normal mb-4 sm:mb-5 max-w-xl border-t border-border pt-4 sm:pt-5">
                {config?.hero_subtitle || config?.title}
              </h2>
            )}

            {/* Sub-subtitle */}
            {isLoading ? (
              <Skeleton className="h-20 w-full max-w-xl mb-8" />
            ) : (config?.hero_subheadline || config?.bio_short) && (
              <p className="text-muted-foreground text-[0.95rem] lg:text-lg mb-7 sm:mb-9 max-w-xl leading-relaxed">
                {config?.hero_subheadline || config?.bio_short}
              </p>
            )}

            {/* CTA Buttons - Clear hierarchy: primary action first */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-start">
              <Button variant="hero" size="default" asChild className="group h-9 px-4 text-sm sm:h-12 sm:px-8 sm:text-base w-full">
                <a href="#projects">
                  View case studies
                  <svg 
                    className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </Button>
              {config?.resume_url ? (
                <Button variant="heroOutline" size="default" asChild className="h-9 px-4 text-sm sm:h-12 sm:px-8 sm:text-base w-full">
                  <a href={config.resume_url} download target="_blank" rel="noopener noreferrer">
                    Download resume
                  </a>
                </Button>
              ) : (
                <Button variant="heroOutline" size="default" asChild className="h-9 px-4 text-sm sm:h-12 sm:px-8 sm:text-base w-full">
                  <a href="#contact">Download resume</a>
                </Button>
              )}
            </div>
          </div>

          {/* Right Content - Photo */}
          <div className="order-1 lg:order-2 flex justify-start lg:justify-center">
            <div className="relative w-full max-w-[15rem] sm:max-w-sm">
              <div className="absolute -inset-3 border border-border pointer-events-none" />
              {/* Photo Container */}
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-muted">
                {isLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : config?.profile_image_url ? (
                  <img
                    src={config.profile_image_url}
                    alt={config.name || 'Profile'}
                    className="w-full h-full object-cover grayscale-[0.15]"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-6xl text-muted-foreground">
                      {config?.name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {(isLoading || (stats && stats.length > 0)) && (
          <div className="mt-12 sm:mt-16 lg:mt-24">
            <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-border">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-none" />
                ))
              ) : (
                stats?.map((stat) => {
                  const IconComponent = getIcon(stat.icon);
                  return (
                    <div
                      key={stat.id}
                      className="group relative p-4 sm:p-6 border-b border-r border-border transition-colors hover:bg-secondary/15"
                    >
                      <IconComponent size={18} strokeWidth={1.5} className="text-accent mb-3 sm:mb-4" />
                      <div className="text-2xl sm:text-3xl lg:text-4xl text-foreground font-serif">
                        <CountUp value={stat.number} duration={2000} delay={100} />
                      </div>
                      <div className="text-[0.8rem] sm:text-sm leading-snug text-muted-foreground mt-1.5">
                        {stat.description}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
