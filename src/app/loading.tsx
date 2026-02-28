export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center gap-8 p-4">
      {/* Animated Logo */}
      <div className="relative">
        <div className="h-20 w-20 rounded-2xl gradient-bg animate-pulse flex items-center justify-center shadow-2xl">
          <div className="text-white text-3xl">📚</div>
        </div>
        {/* Rotating spinner */}
        <div className="absolute -inset-2">
          <div className="h-24 w-24 rounded-2xl border-4 border-transparent border-t-primary border-r-secondary animate-spin" />
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center space-y-3">
        <h3 className="text-xl font-bold gradient-text">Loading LectureScribe</h3>
        <p className="text-sm text-text-muted animate-pulse">Preparing your workspace...</p>
      </div>

      {/* Skeleton cards */}
      <div className="w-full max-w-2xl space-y-4 px-4">
        {[90, 75, 85].map((w, i) => (
          <div
            key={i}
            className="h-4 rounded-full bg-gradient-to-r from-surface-dark via-border to-surface-dark animate-pulse"
            style={{ width: `${w}%`, animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
