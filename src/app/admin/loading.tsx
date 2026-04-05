export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-black text-white animate-pulse">
      {/* Header skeleton */}
      <div className="border-b px-6 py-4" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-6 w-32 rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="h-8 w-8 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>
      </div>
      {/* Tab bar skeleton */}
      <div className="px-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto flex gap-4 py-1">
          <div className="h-10 w-24 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="h-10 w-24 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
      </div>
      {/* KPI row skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="rounded-xl p-4 h-16" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} />
          ))}
        </div>
        {/* Content cards skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl h-48" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} />
          <div className="rounded-2xl h-48" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} />
        </div>
      </div>
    </div>
  );
}
