'use client';

interface DotIndicatorsProps {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}

export function DotIndicators({ total, current, onSelect }: DotIndicatorsProps) {
  return (
    <div className="flex items-center gap-2" role="tablist" aria-label="Slide indicators">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === current}
          aria-label={`Go to slide ${i + 1}`}
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            i === current
              ? 'bg-deck-primary scale-125'
              : 'bg-deck-track hover:bg-deck-secondary'
          }`}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}
