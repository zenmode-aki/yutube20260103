export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden glass animate-pulse"
        >
          <div className="aspect-video bg-slate-700" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-700 rounded w-3/4" />
            <div className="h-3 bg-slate-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

