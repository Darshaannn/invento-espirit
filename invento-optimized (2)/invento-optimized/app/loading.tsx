// app/loading.tsx
// Shown by Next.js during page transitions and initial loads.
// Pure CSS skeleton — zero JS, renders instantly.
export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#F5F1EE] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated brain icon */}
        <div className="w-12 h-12 bg-[#8B0000]/10 skeleton rounded" />
        <div className="w-32 h-3 skeleton rounded" />
        <div className="w-20 h-2 skeleton rounded mt-2" />
      </div>
    </div>
  );
}
