"use client";

import Link from "next/link";
import React, { useEffect } from "react";

export default function NotFound() {
    useEffect(() => {
        // Optional: Add a sound effect or glitch effect here
    }, []);

    return (
        <div className="min-h-screen bg-[#0000AA] text-white font-mono flex items-center justify-center p-8 selection:bg-white selection:text-[#0000AA] cursor-default z-[9999] relative">
            <div className="max-w-3xl w-full space-y-8">
                <h1 className="bg-white text-[#0000AA] inline-block px-2 text-xl font-bold mb-8">
                    ERROR 404
                </h1>

                <p className="text-lg">
                    A problem has been detected and your session has been interrupted to prevent damage to the portfolio experience.
                </p>

                <p className="text-lg">
                    THE_REQUESTED_RESOURCE_WAS_NOT_FOUND
                </p>

                <div className="space-y-2 text-sm opacity-80 mt-8">
                    <p>If this is the first time you've seen this error screen, restart your navigation.</p>
                    <p>If this screen appears again, follow these steps:</p>
                </div>

                <ul className="list-disc list-inside space-y-2 ml-4 text-sm opacity-80">
                    <li>Check to make sure any URL inputs are properly typed.</li>
                    <li>If a problem continues, disable or remove any newly installed anxiety.</li>
                    <li>Disable BIOS memory options such as caching or shadowing.</li>
                </ul>

                <div className="mt-12 space-y-1">
                    <p>Technical Information:</p>
                    <p>*** STOP: 0x00000004 (0x00000000, 0xF404F404, 0x00000000, 0x00000000)</p>
                </div>

                <div className="mt-16 animate-pulse">
                    <Link href="/" className="hover:bg-white hover:text-[#0000AA] px-4 py-2 border border-white transition-colors">
                        Press any key to return to SYSTEM_ROOT...
                    </Link>
                </div>
            </div>
        </div>
    );
}
