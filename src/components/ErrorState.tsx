interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="glass-card p-8 text-center">
      <span className="text-4xl">⚠️</span>
      <p className="mt-3 text-sm font-medium text-white/80">{message}</p>
      <button
        onClick={onRetry}
        className="glass-button mt-4 text-sm text-white"
      >
        다시 시도
      </button>
    </div>
  );
}
