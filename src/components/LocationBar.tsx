interface LocationBarProps {
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function LocationBar({ isLoading, error, onRefresh }: LocationBarProps) {
  return (
    <div className="flex items-center justify-between rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2 text-sm text-white/70">
        <span>{isLoading ? '⏳' : '📍'}</span>
        <span>
          {isLoading
            ? '위치 확인 중...'
            : error
              ? '서울(기본) 기준'
              : '현재 위치 기반'}
        </span>
      </div>
      <button
        onClick={onRefresh}
        aria-label="새로고침"
        className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        🔄
      </button>
    </div>
  );
}
