import { useEffect, useRef, useState } from 'react';

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

export function CountUp({
  value,
  duration = 2000,
  delay = 0,
  prefix = '',
  suffix = '',
}: {
  value: string;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState('0');
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const targetMatch = value.match(/^\s*([+-]?\d+(?:\.\d+)?)(.*)$/);
    const target = targetMatch ? parseFloat(targetMatch[1]) : NaN;
    const suffixPart = suffix || (targetMatch ? targetMatch[2].trim() : '');

    if (Number.isNaN(target)) {
      setDisplay(value);
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setDisplay(`${prefix}${target}${suffixPart}`);
      return;
    }

    const element = ref.current;
    if (!element) return;

    let raf: number;
    let observer: IntersectionObserver;

    const start = () => {
      if (hasStarted) return;
      setHasStarted(true);
      const startTime = performance.now() + delay;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        if (elapsed < 0) {
          raf = requestAnimationFrame(tick);
          return;
        }
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);
        const current = target * eased;

        if (Number.isInteger(target)) {
          setDisplay(`${prefix}${Math.round(current)}${suffixPart}`);
        } else {
          setDisplay(`${prefix}${current.toFixed(2)}${suffixPart}`);
        }

        if (progress < 1) {
          raf = requestAnimationFrame(tick);
        }
      };

      raf = requestAnimationFrame(tick);
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration, delay, prefix, suffix, hasStarted]);

  return <span ref={ref}>{display}</span>;
}
