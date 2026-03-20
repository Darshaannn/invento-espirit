// app/screening/loading.tsx
// Shown during assessment load transitions.
// UPDATED: Dark Clinical HUD Theme
export default function ScreeningLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-full max-w-2xl px-8 space-y-12">
        {/* Progress header skeleton */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="h-3 w-16 bg-white/5 skeleton rounded-full" />
            <div className="h-3 w-32 bg-white/5 skeleton rounded-full" />
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-1/4 bg-red-500/30 rounded-full animate-[loading_3s_infinite_ease-in-out]" />
          </div>
        </div>

        {/* Question card skeleton */}
        <div className="space-y-8 py-4">
          <div className="h-5 w-24 bg-white/10 skeleton rounded-lg" />
          <div className="space-y-4">
            <div className="h-10 w-full bg-white/5 skeleton rounded-xl" />
            <div className="h-10 w-4/5 bg-white/5 skeleton rounded-xl" />
          </div>
        </div>

        {/* Answer grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-white/5 border border-white/5 skeleton rounded-2xl" />
          ))}
        </div>

        {/* Footer actions skeleton */}
        <div className="flex justify-between items-center pt-8 border-t border-white/5">
          <div className="h-12 w-32 bg-white/5 skeleton rounded-lg" />
          <div className="h-12 w-32 bg-white/5 skeleton rounded-lg" />
        </div>
      </div>
    </div>
  );
}
