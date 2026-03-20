// app/(dashboard)/dashboard/loading.tsx
// Shown instantly while dashboard page.tsx fetches data server-side.
// Pure CSS animation — no JS needed.
// UPDATED: Dark Clinical HUD Theme
export default function DashboardLoading() {
  return (
    <div className="flex-1 p-8 lg:p-12 space-y-12 bg-[#0A0A0A] overflow-hidden">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="h-10 bg-white/5 border border-white/5 skeleton rounded-lg w-1/4" />
        <div className="h-4 bg-white/5 skeleton rounded-full w-1/3" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-white/5 border border-white/5 skeleton rounded-2xl" />
        ))}
      </div>

      {/* Main chart area */}
      <div className="relative group">
        <div className="h-80 bg-white/5 border border-white/5 skeleton rounded-3xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-red-500/20 border-t-red-500/80 rounded-full animate-spin" />
        </div>
      </div>

      {/* Domain rings row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-48 bg-white/5 border border-white/5 skeleton rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
