// app/screening/loading.tsx
export default function ScreeningLoading() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center animate-pulse">
      <div className="w-full max-w-2xl px-8 space-y-8">
        {/* Progress bar */}
        <div className="h-1 bg-white/10 rounded-full">
          <div className="h-full w-1/4 bg-[#8B0000]/40 rounded-full" />
        </div>
        {/* Question card */}
        <div className="space-y-6">
          <div className="h-4 bg-white/10 rounded w-1/4" />
          <div className="h-12 bg-white/8 rounded w-full" />
          <div className="h-8 bg-white/5 rounded w-3/4" />
        </div>
        {/* Answer options */}
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl border border-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
