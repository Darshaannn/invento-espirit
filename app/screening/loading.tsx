export default function ScreeningLoading() {
    return (
        <div className="min-h-screen bg-[#F5F1EE] p-6 lg:p-12 flex flex-col font-sans animate-pulse">
            {/* Header skeleton */}
            <div className="mb-16">
                <div className="h-6 w-32 bg-[#1A1A1A]/10 mb-4" />
                <div className="h-16 w-3/4 max-w-2xl bg-[#1A1A1A]/10" />
            </div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 flex-1">
                {/* Left column: Form skeleton */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                    <div className="space-y-12 max-w-3xl">
                        {/* Field block 1 */}
                        <div className="space-y-4">
                            <div className="h-8 w-48 bg-[#1A1A1A]/10" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-white border border-[#1A1A1A]/5" />)}
                            </div>
                        </div>

                        {/* Field block 2 */}
                        <div className="space-y-4">
                            <div className="h-8 w-48 bg-[#1A1A1A]/10" />
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-white border border-[#1A1A1A]/5" />)}
                            </div>
                        </div>

                        {/* Field block 3 (Keywords) */}
                        <div className="space-y-4">
                            <div className="h-8 w-64 bg-[#1A1A1A]/10" />
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-10 w-24 bg-white border border-[#1A1A1A]/5" />)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-16">
                        <div className="h-20 w-80 bg-[#1A1A1A]/10" />
                    </div>
                </div>

                {/* Right column: Info skeleton */}
                <div className="lg:col-span-4 space-y-8 mt-12 lg:mt-0">
                    <div className="h-20 bg-white border border-[#1A1A1A]/5" />
                    <div className="h-32 bg-white border border-[#1A1A1A]/5" />
                </div>
            </div>
        </div>
    );
}
