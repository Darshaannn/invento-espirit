// app/(dashboard)/dashboard/loading.tsx
// Shown instantly while dashboard page.tsx fetches data server-side.
// Pure CSS animation — no JS needed.

export default function DashboardLoading() {
  return (
    <div className="flex-1 p-8 lg:p-12 space-y-8 bg-[#F5F1EE] animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 bg-[#1A1A1A]/8 rounded w-1/3" />
        <div className="h-4 bg-[#1A1A1A]/5 rounded w-1/2" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-[#1A1A1A]/6 rounded-xl" />
        ))}
      </div>

      {/* Main chart */}
      <div className="h-64 bg-[#1A1A1A]/6 rounded-xl" />

      {/* Domain rings row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 bg-[#1A1A1A]/6 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
