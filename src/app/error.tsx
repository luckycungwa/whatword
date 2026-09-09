'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f3f3]">
        <span className="text-2xl">!</span>
      </div>
      <h1 className="text-2xl font-bold text-[#141414]">Something went wrong</h1>
      <p className="mt-3 max-w-md text-[#707070]">
        An unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-[#141414] px-6 py-3 text-sm font-semibold text-white hover:bg-[#262626]"
      >
        Try again
      </button>
    </div>
  );
}
