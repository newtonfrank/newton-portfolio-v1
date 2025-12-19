"use client";

export function useScrollTo() {
    const scrollTo = (elementId: string, withHaptic: boolean = true) => {
        const element = document.getElementById(elementId);
        if (element) {
            // Trigger haptic feedback on mobile if supported
            if (withHaptic && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                navigator.vibrate(5);
            }

            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return { scrollTo };
}
