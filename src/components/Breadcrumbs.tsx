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
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-[#adadad]">
        <li>
          <Link href="/" className="transition-colors hover:text-[#141414]">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-[#e0e0e0]" />
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-[#141414]">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-[#707070]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
