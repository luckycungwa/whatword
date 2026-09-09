export default function GamesLoading() {
  return (
    <div className="container-app py-8 md:py-12 animate-pulse">
      <div className="mb-6 h-3 w-20 rounded-full bg-[#f0f0f0]" />
      <div className="mx-auto max-w-2xl">
        <div className="h-9 w-40 rounded-full bg-[#f0f0f0]" />
        <div className="mt-3 h-5 w-64 rounded-full bg-[#f0f0f0]" />
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-[#e0e0e0] bg-white p-8">
            <div className="mx-auto h-12 w-12 rounded-full bg-[#f0f0f0]" />
            <div className="mx-auto mt-4 h-5 w-32 rounded-full bg-[#f0f0f0]" />
            <div className="mx-auto mt-2 h-3 w-48 rounded-full bg-[#f0f0f0]" />
            <div className="mx-auto mt-4 h-10 w-28 rounded-full bg-[#f0f0f0]" />
          </div>
        ))}
      </div>
    </div>
  );
}
