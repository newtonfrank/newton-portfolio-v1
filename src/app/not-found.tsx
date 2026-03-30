"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative z-[9999] flex min-h-screen items-center justify-center bg-[#f2f2f2] p-8 font-mono text-black selection:bg-black selection:text-white">
      <div className="w-full max-w-3xl space-y-7 rounded-2xl border border-[#cfcfcf] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
        <h1 className="inline-block border border-black bg-black px-3 py-1 text-lg font-bold text-white">ERROR 404</h1>

        <p className="text-base leading-relaxed text-[#232323]">
          The requested page could not be found. The route may have changed or the link is no longer active.
        </p>

        <div className="space-y-2 text-sm text-[#505050]">
          <p>Suggested actions:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Verify the URL spelling and path structure.</li>
            <li>Return to the homepage and navigate from the main sections.</li>
            <li>Contact me if you reached this page from an external reference.</li>
          </ul>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm uppercase tracking-[0.14em] text-white transition-colors hover:bg-neutral-800"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
