import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'WhatWord privacy policy. Learn how we handle your data and protect your privacy.',
  alternates: { canonical: 'https://whatword.co.za/privacy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="container-app pb-10 pt-6 sm:pb-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-[#707070] hover:text-[#141414]"
        >
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-[#141414]">Privacy Policy</h1>
        <div className="prose prose-surface mt-8 space-y-6 text-[#707070]">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 className="text-xl font-semibold text-[#141414]">Introduction</h2>
          <p>
            Welcome to WhatWord. We respect your privacy and are committed to
            protecting your personal data. This privacy policy explains how we
            use any information we collect from you.
          </p>
          <h2 className="text-xl font-semibold text-[#141414]">Information We Collect</h2>
          <p>
            WhatWord is an educational dictionary tool. We do not collect personal
            information unless you voluntarily provide it. We may collect
            anonymised usage data to improve our service.
          </p>
          <h2 className="text-xl font-semibold text-[#141414]">How We Use Your Information</h2>
          <p>
            Any information collected is used solely to provide and improve the
            WhatWord service. We do not sell or share personal information with
            third parties.
          </p>
          <h2 className="text-xl font-semibold text-[#141414]">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us through our website.
          </p>
        </div>
      </div>
    </div>
  );
}
