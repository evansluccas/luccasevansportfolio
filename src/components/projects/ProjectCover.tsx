interface ProjectCoverProps {
  heading: string;
  subheading?: string | null;
  category?: string | null;
  className?: string;
}

/**
 * Editorial, CSS-only project cover used in place of an uploaded image.
 * Blends with the page's cream/olive/sage palette and hairline aesthetic.
 */
export function ProjectCover({ heading, subheading, category, className = '' }: ProjectCoverProps) {
  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-secondary/30 ${className}`}
      role="img"
      aria-label={subheading ? `${heading} — ${subheading}` : heading}
    >
      {/* Hairline grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />
      {/* Soft wash */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-background/70 via-transparent to-primary/10"
      />

      <div className="relative h-full flex flex-col justify-end p-4 sm:p-5">
        {category && (
          <span className="absolute top-4 left-4 sm:top-5 sm:left-5 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
            {category}
          </span>
        )}
        <span aria-hidden className="block w-8 h-px bg-primary/50 mb-2.5" />
        <h4 className="text-base sm:text-lg leading-snug text-foreground">{heading}</h4>
        {subheading && (
          <p className="mt-1 text-[0.75rem] sm:text-sm italic text-muted-foreground leading-relaxed">
            {subheading}
          </p>
        )}
      </div>
    </div>
  );
}