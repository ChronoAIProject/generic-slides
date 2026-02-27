interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="absolute top-0 inset-x-0 h-[3px] bg-deck-track overflow-hidden z-20">
      <div
        className="h-full transition-[width] duration-300 ease-out animate-[shimmer_3s_linear_infinite]"
        style={{
          width: `${progress}%`,
          backgroundImage: 'linear-gradient(90deg, #E8A87C, #D4798A, #A578C2, #85C1E9, #82E0AA, #E8A87C)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
}
