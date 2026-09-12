import Link from 'next/link';

const footerSections = [
  {
    title: 'Dictionary',
    links: [
      { href: '/words', label: 'All Words' },
      { href: '/word-finder', label: 'Word Finder' },
      { href: '/synonyms', label: 'Synonyms' },
      { href: '/antonyms', label: 'Antonyms' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { href: '/learn', label: 'Vocabulary Hub' },
      { href: '/learn/beginner', label: 'Beginner' },
      { href: '/learn/intermediate', label: 'Intermediate' },
      { href: '/learn/advanced', label: 'Advanced' },
    ],
  },
  {
    title: 'Games',
    links: [
      { href: '/games', label: 'All Games' },
      { href: '/games/whatword', label: 'WhatWord Challenge' },
      { href: '/games/definition-challenge', label: 'Definition Challenge' },
      { href: '/games/word-scramble', label: 'Word Scramble' },
      { href: '/games/spelling', label: 'Spelling' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 rounded-t-3xl bg-[#141414]">
      <div className="container-app py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="text-xl font-bold text-white">
              What<span className="text-[#0066ff]">Word</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[#707070]">
              Your complete English dictionary platform.
            </p>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#707070]">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#adadad] transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-[#262626] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-[#707070]">
              &copy; {new Date().getFullYear()} WhatWord. Built by Lucky Cungwa.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-xs text-[#707070] hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-xs text-[#707070] hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
