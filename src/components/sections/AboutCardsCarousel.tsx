import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAboutIcon } from '@/lib/aboutIcons';

interface AboutCard {
  id: string;
  icon: string | null;
  title: string;
  description: string;
}

const AUTOPLAY_MS = 5000;
const TRANSITION_MS = 700;

export function AboutCardsCarousel({ cards }: { cards: AboutCard[] }) {
  const [index, setIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDelta = useRef(0);

  const total = cards.length;

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = window.setInterval(() => {
      navigate(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, total, index]);

  const navigate = (delta: number) => {
    if (total <= 1) return;
    const next = (index + delta + total) % total;
    if (next === index) return;
    setDirection(delta > 0 ? 1 : -1);
    setExitingIndex(index);
    setIndex(next);
    window.setTimeout(() => setExitingIndex(null), TRANSITION_MS);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDelta.current = 0;
    setPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDelta.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    const start = touchStartX.current;
    const delta = touchDelta.current;
    touchStartX.current = null;
    touchDelta.current = 0;
    if (start === null) return;
    if (Math.abs(delta) > 40) {
      navigate(delta < 0 ? 1 : -1);
    }
    window.setTimeout(() => setPaused(false), 6000);
  };

  return (
    <div className="border-t border-border">
      {/* Swap stage */}
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative grid h-[260px] sm:h-[280px]">
          {cards.map((card, i) => {
            const IconComponent = getAboutIcon(card.icon);
            const isActive = i === index;
            const isExiting = i === exitingIndex;

            return (
              <div
                key={card.id}
                aria-hidden={!isActive}
                className={`
                  col-start-1 row-start-1 px-1 py-8
                  transition-all duration-700 ease-out will-change-transform
                  ${isActive
                    ? 'opacity-100 translate-x-0 scale-100 z-20'
                    : isExiting
                      ? direction > 0
                        ? '-translate-x-full opacity-0 z-10'
                        : 'translate-x-full opacity-0 z-10'
                      : direction > 0
                        ? 'translate-x-full opacity-0 z-0 pointer-events-none'
                        : '-translate-x-full opacity-0 z-0 pointer-events-none'}
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
      </div>

      {/* Controls rail */}
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
                const delta = i - index;
                navigate(delta > 0 ? 1 : -1);
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

        {/* Swap hint */}
        <div className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.15em] uppercase text-muted-foreground/60 animate-pulse">
          <ChevronLeft size={12} />
          <span>Swap</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
}

