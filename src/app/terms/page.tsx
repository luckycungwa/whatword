import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'WhatWord terms of service. Read the rules and guidelines for using our platform.',
  alternates: { canonical: 'https://whatword.co.za/terms' },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="container-app py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-[#707070] hover:text-[#141414]"
        >
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-[#141414]">Terms of Service</h1>
        <div className="prose prose-surface mt-8 space-y-6 text-[#707070]">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 className="text-xl font-semibold text-[#141414]">Acceptance of Terms</h2>
          <p>
            By accessing and using WhatWord, you accept and agree to be bound by
            these Terms of Service. If you do not agree to these terms, please do
            not use our service.
          </p>
          <h2 className="text-xl font-semibold text-[#141414]">Use of Service</h2>
          <p>
            WhatWord provides educational content for English language learning.
            Our content is provided for informational and educational purposes
            only.
          </p>
          <h2 className="text-xl font-semibold text-[#141414]">Intellectual Property</h2>
          <p>
            All content on WhatWord, including definitions, examples, and
            educational materials, is owned by or licensed to WhatWord and is
            protected by intellectual property laws.
          </p>
          <h2 className="text-xl font-semibold text-[#141414]">Disclaimer</h2>
          <p>
            While we strive to provide accurate and up-to-date information,
            WhatWord makes no representations or warranties about the accuracy or
            completeness of the content on this platform.
          </p>
        </div>
      </div>
    </div>
  );
}
