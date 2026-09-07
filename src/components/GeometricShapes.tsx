'use client';

import { motion } from 'framer-motion';

export function GeometricShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Large circle - top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#141414]"
      />

      {/* Small diamond - top left */}
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.03, rotate: 45 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute top-32 left-12 h-12 w-12 bg-[#141414]"
      />

      {/* Ring - bottom left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.04, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.5 }}
        className="absolute bottom-20 left-8 h-24 w-24 rounded-full border-2 border-[#e0e0e0]"
      />

      {/* Cross - mid right */}
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute right-1/4 top-1/2 h-16 w-16 text-[#141414]"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="32" y1="8" x2="32" y2="56" />
        <line x1="8" y1="32" x2="56" y2="32" />
      </motion.svg>

      {/* Small dots cluster - bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="absolute bottom-32 right-16"
      >
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#141414]" />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
