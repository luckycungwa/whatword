'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/words', label: 'Dictionary' },
  { href: '/word-finder', label: 'Word Finder' },
  { href: '/learn', label: 'Learn' },
  { href: '/games', label: 'Games' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(href + '/'),
    [pathname]
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-app flex justify-center py-4">
        {/* Desktop: floating pill nav — centered, stable height */}
        <nav
          className="hidden min-h-[44px] items-center gap-1 rounded-full bg-[#f3f3f3] px-2 py-2 md:flex"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className="mr-2 flex items-center gap-2 rounded-full px-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20"
            aria-label="WhatWord Home"
          >
            <span className="text-base font-bold tracking-tight text-[#141414]">
              What<span className="text-[#0066ff]">Word</span>
            </span>
          </Link>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20 ${
                isActive(link.href)
                  ? 'bg-white text-[#141414] shadow-sm'
                  : 'text-[#707070] hover:text-[#141414]'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/games"
            className="ml-2 inline-flex min-h-[36px] items-center justify-center rounded-full bg-[#141414] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#262626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/30"
          >
            Play
          </Link>
        </nav>

        {/* Mobile: floating pill bar — consistent height, aligned to same container */}
        <div className="flex w-full items-center justify-between gap-4 md:hidden">
          <div className="flex min-h-[44px] flex-1 items-center justify-between rounded-full border border-[#f0f0f0] bg-white px-3 py-2 shadow-sm">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20"
              aria-label="WhatWord Home"
            >
              <span className="text-[17px] font-bold tracking-tight text-[#141414]">
                What<span className="text-[#0066ff]">Word</span>
              </span>
            </Link>

            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3f3f3] text-[#141414] transition-colors hover:bg-[#e8e8e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20 active:bg-[#e8e8e8]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — anchored to container, no overflow */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="container-app md:hidden"
          >
            <div className="overflow-hidden rounded-2xl border border-[#f0f0f0] bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-xl px-4 py-3.5 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20 ${
                    isActive(link.href)
                      ? 'bg-[#f3f3f3] text-[#141414]'
                      : 'text-[#707070] hover:bg-[#f3f3f3] hover:text-[#141414]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
