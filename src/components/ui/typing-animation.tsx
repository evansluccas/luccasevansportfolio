import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface TypingAnimationProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TypingAnimation({
  texts,
  className,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypingAnimationProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const filteredTexts = texts.filter(Boolean);

  const animateText = useCallback(() => {
    if (filteredTexts.length === 0) return;

    const currentFullText = filteredTexts[currentTextIndex];

    if (isPaused) {
      return;
    }

    if (!isDeleting) {
      // Typing
      if (displayedText.length < currentFullText.length) {
        setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
      } else {
        // Finished typing, pause before deleting
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting
      if (displayedText.length > 0) {
        setDisplayedText(displayedText.slice(0, -1));
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % filteredTexts.length);
      }
    }
  }, [displayedText, isDeleting, isPaused, currentTextIndex, filteredTexts, pauseDuration]);

  useEffect(() => {
    if (filteredTexts.length === 0) return;

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(animateText, speed);

    return () => clearTimeout(timer);
  }, [animateText, isDeleting, typingSpeed, deletingSpeed, filteredTexts.length]);

  // Handle single text case - just display without animation
  if (filteredTexts.length <= 1) {
    return (
      <span className={cn(className)}>
        {filteredTexts[0] || ''}
      </span>
    );
  }

  return (
    <span className={cn(className)}>
      {displayedText}
      <span className="inline-block w-0.5 h-[1em] bg-primary ml-1 animate-pulse" />
    </span>
  );
}
