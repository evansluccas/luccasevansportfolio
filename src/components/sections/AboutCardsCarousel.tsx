import { useEffect, useRef, useState } from 'react';
import { getAboutIcon } from '@/lib/aboutIcons';

interface AboutCard {
  id: string;
  icon: string | null;
  title: string;
  description: string;
}

const AUTOPLAY_MS = 5000;

export function AboutCardsCarousel({ cards }: { cards: AboutCard[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = cards.length;

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, total]);

  const go = (next: number) => setIndex((next + total) % total);

  return (
    <div
      className="border-t border-border"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        if (start === null) return;
        const delta = e.changedTouches[0].clientX - start;
        if (Math.abs(delta) > 40) go(delta < 0 ? index + 1 : index - 1);
        window.setTimeout(() => setPaused(false), 6000);
      }}
    >
      {/* Stacked crossfade stage */}
      <div className="relative grid">
        {cards.map((card, i) => {
          const IconComponent = getAboutIcon(card.icon);
          const isActive = i === index;
          return (
            <div
              key={card.id}
              aria-hidden={!isActive}
              className={`
                col-start-1 row-start-1 px-1 py-8
                transition-all duration-700 ease-out will-change-transform
                ${isActive
                  ? 'opacity-100 translate-y-0 scale-100 blur-0'
                  : 'opacity-0 translate-y-3 scale-[0.97] blur-[2px] pointer-events-none'}
              `}
            >
              <IconComponent size={20} className="text-accent mb-5" strokeWidth={1.5} />
              <h3 className="text-xl mb-2.5 text-foreground">{card.title}</h3>
              <p className="text-muted-foreground text-[0.9rem] leading-relaxed">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Progress rail */}
      <div className="flex items-center gap-3 border-t border-border pt-4">
        <span className="text-[0.7rem] tracking-[0.18em] uppercase text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <div className="flex-1 flex gap-1.5">
          {cards.map((card, i) => (
            <button
              key={card.id}
              aria-label={`Show ${card.title}`}
              onClick={() => {
                setIndex(i);
                setPaused(true);
                window.setTimeout(() => setPaused(false), 8000);
              }}
              className="flex-1 h-6 flex items-center"
            >
              <span
                className={`block w-full h-px transition-all duration-500 ${
                  i === index ? 'bg-accent h-[2px]' : 'bg-border'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}