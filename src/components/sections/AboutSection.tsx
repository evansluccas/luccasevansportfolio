import { useAboutCards, useSectionConfig } from '@/hooks/usePortfolioData';
import { getAboutIcon } from '@/lib/aboutIcons';
import { Skeleton } from '@/components/ui/skeleton';
import { Reveal } from '@/components/ui/Reveal';
import { AboutCardsCarousel } from './AboutCardsCarousel';


export function AboutSection() {
  const { data: cards, isLoading: cardsLoading } = useAboutCards();
  const { data: sectionConfig, isLoading: configLoading } = useSectionConfig('about');

  // Don't render if section is hidden
  if (!configLoading && sectionConfig && !sectionConfig.is_visible) {
    return null;
  }

  // Don't render if no cards
  if (!cardsLoading && (!cards || cards.length === 0)) {
    return null;
  }

  const isLoading = cardsLoading || configLoading;

  return (
    <section id="about" className="relative section-padding overflow-hidden bg-background">
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-14">
          {isLoading ? (
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
              <h2 className="text-[1.9rem] leading-tight sm:text-4xl lg:text-5xl mb-4 sm:mb-5">
                {sectionConfig?.title || 'Know Who'}{' '}
                <span className="italic text-accent">{sectionConfig?.title_highlight || 'I Am'}</span>
              </h2>
              {sectionConfig?.description && (
                <p className="text-muted-foreground text-[0.95rem] sm:text-lg">
                  {sectionConfig.description}
                </p>
              )}
            </>
          )}
        </div>

        {cardsLoading && <Skeleton className="h-56 rounded-none sm:hidden" />}

        {/* Mobile: crossfade carousel */}
        {!cardsLoading && cards && cards.length > 0 && (
          <div className="sm:hidden">
            <AboutCardsCarousel cards={cards as any} />
          </div>
        )}

        {/* Characteristics Grid (sm+) */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
          {cardsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-none" />
            ))
          ) : (
            cards?.map((card, i) => {
              const IconComponent = getAboutIcon(card.icon);
              return (
                <Reveal
                  key={card.id}
                  immediate={i === 0}
                  delay={i === 0 ? 0 : 0.1}
                  className="group p-6 sm:p-8 border-b border-r border-border transition-colors hover:bg-secondary/15"
                >
                  <IconComponent size={20} className="text-accent mb-4 sm:mb-6" strokeWidth={1.5} />
                  <h3 className="text-lg sm:text-xl mb-2.5 sm:mb-3 text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground text-[0.9rem] sm:text-sm leading-relaxed">
                    {card.description}
                  </p>
                </Reveal>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
