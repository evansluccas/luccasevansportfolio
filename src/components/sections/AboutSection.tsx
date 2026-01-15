import { BlobDecoration } from '@/components/decorations/BlobDecoration';
import { useAboutCards, useSiteConfig } from '@/hooks/usePortfolioData';
import { getAboutIcon } from '@/lib/aboutIcons';
import { Skeleton } from '@/components/ui/skeleton';

export function AboutSection() {
  const { data: cards, isLoading: cardsLoading } = useAboutCards();
  const { data: config } = useSiteConfig();

  // Don't render if no cards
  if (!cardsLoading && (!cards || cards.length === 0)) {
    return null;
  }

  return (
    <section id="about" className="relative section-padding overflow-hidden">
      <BlobDecoration 
        className="-right-32 top-1/4 opacity-20" 
        size="lg" 
        variant="accent"
      />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-pill bg-primary/10 text-primary text-sm font-medium mb-4">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            What I <span className="text-primary">Bring</span> to the Table
          </h2>
          {config?.bio_long && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {config.bio_long}
            </p>
          )}
        </div>

        {/* Characteristics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))
          ) : (
            cards?.map((card) => {
              const IconComponent = getAboutIcon(card.icon);
              return (
                <div
                  key={card.id}
                  className="p-8 rounded-2xl bg-card border border-primary/20 hover-lift group transition-all duration-300"
                >
                  <div className="p-4 rounded-xl bg-primary/20 w-fit mb-6 group-hover:bg-primary/30 transition-colors">
                    <IconComponent size={28} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
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
