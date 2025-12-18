"use client";

export const GrainOverlay = () => {
    return (
        <div className="pointer-events-none fixed inset-0 z-[50] opacity-20 mix-blend-overlay">
            <div className="absolute inset-0 bg-noise animate-noise"></div>
        </div>
    );
};
