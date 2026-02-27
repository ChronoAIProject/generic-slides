interface SlideCounterProps {
  current: number;
  total: number;
}

export function SlideCounter({ current, total }: SlideCounterProps) {
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <span className="font-body font-normal text-sm text-deck-secondary tabular-nums">
      {pad(current)} / {pad(total)}
    </span>
  );
}
