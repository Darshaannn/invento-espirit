export default function AnalysisLoading() {
    return (
        <div className="min-h-screen bg-[#0F0A1F] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#9D50FF]/20 border-t-[#9D50FF] animate-spin mx-auto mb-6 rounded-full" />
                <p className="text-white/40 text-xs font-black uppercase tracking-widest">Processing analysis...</p>
            </div>
        </div>
    );
}
