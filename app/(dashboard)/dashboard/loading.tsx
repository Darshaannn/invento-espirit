export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-[#F5F1EE] p-6 md:p-12 animate-pulse">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="h-10 bg-[#1A1A1A]/10 w-1/4 rounded" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 bg-white h-80 rounded border border-[#1A1A1A]/5" />
                    <div className="lg:col-span-4 bg-[#121212] h-80 rounded" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white h-48 rounded border border-[#1A1A1A]/5" />
                    ))}
                </div>
            </div>
        </div>
    );
}
