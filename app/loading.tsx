// app/loading.tsx
// Shown by Next.js during page transitions and initial loads.
// Pure CSS skeleton — zero JS, renders instantly.
// UPDATED: Dark Clinical HUD Theme
export default function GlobalLoading() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                {/* Animated brain icon placeholder */}
                <div className="w-16 h-16 bg-white/5 border border-white/10 skeleton rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full animate-pulse" />
                </div>

                {/* Metadata skeletons */}
                <div className="space-y-3 flex flex-col items-center">
                    <div className="w-48 h-2.5 bg-white/10 skeleton rounded-full" />
                    <div className="w-32 h-2 bg-white/5 skeleton rounded-full" />
                </div>

                {/* Progress indicator */}
                <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                    <div className="w-1/3 h-full bg-red-500/40 rounded-full animate-[loading_2s_infinite_ease-in-out]" />
                </div>
            </div>
        </div>
    );
}
