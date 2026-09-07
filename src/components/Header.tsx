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
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      {/* Desktop: floating pill nav */}
      <nav
        className="hidden items-center gap-1 rounded-full bg-[#f3f3f3] px-2 py-2 md:flex"
        aria-label="Main navigation"
      >
        <Link href="/" className="mr-2 flex items-center gap-2 pl-3 pr-4" aria-label="WhatWord Home">
          <span className="text-base font-bold tracking-tight text-[#141414]">
            What<span className="text-[#0066ff]">Word</span>
          </span>
        </Link>

        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isActive(link.href)
                ? 'bg-white text-[#141414]'
                : 'text-[#707070] hover:text-[#141414]'
            }`}
          >
            {link.label}
          </Link>
        ))}

        <Link href="/games" className="ml-2 btn-primary !py-2 !px-5 !text-sm">
          Play
        </Link>
      </nav>

      {/* Mobile: floating pill with hamburger */}
      <div className="flex w-full items-center justify-between md:hidden">
        <Link href="/" className="flex items-center gap-2" aria-label="WhatWord Home">
          <span className="text-lg font-bold tracking-tight text-[#141414]">
            What<span className="text-[#0066ff]">Word</span>
          </span>
        </Link>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f3f3] text-[#141414] transition-colors hover:bg-[#e8e8e8]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-[#f0f0f0] bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-[#f3f3f3] text-[#141414]'
                    : 'text-[#707070] hover:bg-[#f3f3f3] hover:text-[#141414]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
