export default function GameLoading() {
  return (
    <div className="container-app py-8 md:py-12 animate-pulse">
      <div className="mb-6 h-3 w-32 rounded-full bg-[#f0f0f0]" />
      <div className="mx-auto max-w-xl">
        <div className="h-9 w-48 rounded-full bg-[#f0f0f0]" />
        <div className="mt-3 h-5 w-64 rounded-full bg-[#f0f0f0]" />
        <div className="mt-8 rounded-3xl border border-[#e0e0e0] bg-white p-8">
          <div className="mx-auto h-16 w-48 rounded-full bg-[#f0f0f0]" />
          <div className="mt-6 flex justify-center gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 w-14 rounded-2xl bg-[#f0f0f0]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
