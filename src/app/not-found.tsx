import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f3f3f3]">
        <Search className="h-10 w-10 text-[#141414]" />
      </div>
      <h1 className="text-4xl font-bold text-[#141414]">Word Not Found</h1>
      <p className="mt-4 max-w-md text-lg text-[#707070]">
        We couldn&apos;t find the word you&apos;re looking for. It might have been
        removed or the URL may be incorrect.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#141414] px-6 py-3 font-medium text-white transition-colors hover:bg-[#141414]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
