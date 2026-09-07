export function WordCardSkeleton() {
  return (
    <div className="word-card animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-5 w-24 rounded-full bg-[#f0f0f0]" />
        <div className="h-4 w-12 rounded-full bg-[#f0f0f0]" />
      </div>
      <div className="mt-2 h-3 w-full rounded-full bg-[#f0f0f0]" />
      <div className="mt-1 h-3 w-3/4 rounded-full bg-[#f0f0f0]" />
    </div>
  );
}

export function WordPageSkeleton() {
  return (
    <div className="container-app py-8 animate-pulse">
      <div className="h-4 w-32 rounded-full bg-[#f0f0f0] mb-8" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-[#f3f3f3] p-8">
            <div className="h-8 w-48 rounded-full bg-[#e0e0e0]" />
            <div className="mt-3 h-4 w-32 rounded-full bg-[#e0e0e0]" />
            <div className="mt-8 space-y-4">
              <div className="h-4 w-full rounded-full bg-[#e0e0e0]" />
              <div className="h-4 w-5/6 rounded-full bg-[#e0e0e0]" />
              <div className="h-4 w-4/6 rounded-full bg-[#e0e0e0]" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#f3f3f3] p-6">
            <div className="h-5 w-24 rounded-full bg-[#e0e0e0] mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-3 w-full rounded-full bg-[#e0e0e0]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="h-4 w-20 rounded-full bg-[#f0f0f0]" />
          <div className="h-3 w-32 rounded-full bg-[#f0f0f0]" />
        </div>
      ))}
    </div>
  );
}
