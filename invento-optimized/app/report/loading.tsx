// app/report/loading.tsx
export default function ReportLoading() {
  return (
    <div className="min-h-screen bg-[#F5F1EE] p-8 lg:p-16 animate-pulse">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="h-10 bg-[#1A1A1A]/8 rounded w-2/5" />
        <div className="h-64 bg-[#1A1A1A]/6 rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-[#1A1A1A]/6 rounded-xl" />
          <div className="h-32 bg-[#1A1A1A]/6 rounded-xl" />
        </div>
        <div className="h-48 bg-[#1A1A1A]/6 rounded-xl" />
        <div className="h-24 bg-[#1A1A1A]/6 rounded-xl" />
      </div>
    </div>
  );
}
