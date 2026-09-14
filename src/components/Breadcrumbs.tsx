import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="pb-8 pt-8 sm:pb-10 sm:pt-8">
      <ol className="flex flex-wrap items-center gap-1 text-[13px] leading-6 text-[#888888] sm:text-sm">
        <li>
          <Link
            href="/"
            className="rounded-full px-1.5 py-1 transition-colors hover:text-[#141414] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20"
          >
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex min-w-0 items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#c0c0c0]" aria-hidden="true" />
            {item.href ? (
              <Link
                href={item.href}
                className="truncate rounded-full px-1.5 py-1 transition-colors hover:text-[#141414] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20"
              >
                {item.label}
              </Link>
            ) : (
              <span className="truncate px-1.5 py-1 font-medium text-[#707070]" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
