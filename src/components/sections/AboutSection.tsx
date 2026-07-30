import { useAboutCards, useSectionConfig } from '@/hooks/usePortfolioData';
import { getAboutIcon } from '@/lib/aboutIcons';
import { Skeleton } from '@/components/ui/skeleton';

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
        <div className="max-w-3xl mb-14">
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
              <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5">
                {sectionConfig?.title || 'Know Who'}{' '}
                <span className="italic text-accent">{sectionConfig?.title_highlight || 'I Am'}</span>
              </h2>
              {sectionConfig?.description && (
                <p className="text-muted-foreground text-lg">
                  {sectionConfig.description}
                </p>
              )}
            </>
          )}
        </div>

        {/* Characteristics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
          {cardsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-none" />
            ))
          ) : (
            cards?.map((card) => {
              const IconComponent = getAboutIcon(card.icon);
              return (
                <div
                  key={card.id}
                  className="group p-8 border-b border-r border-border transition-colors hover:bg-secondary/15"
                >
                  <IconComponent size={22} className="text-accent mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl mb-3 text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
