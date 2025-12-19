"use client";

import React, { useEffect, useState } from "react";
import useSound from "use-sound";

export const KonamiCode = () => {
    const [input, setInput] = useState<string[]>([]);
    const [doomMode, setDoomMode] = useState(false);

    // Konami Code Sequence: Up, Up, Down, Down, Left, Right, Left, Right, B, A
    const sequence = [
        "ArrowUp", "ArrowUp",
        "ArrowDown", "ArrowDown",
        "ArrowLeft", "ArrowRight",
        "ArrowLeft", "ArrowRight",
        "b", "a"
    ];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const nextInput = [...input, e.key];
            if (nextInput.length > sequence.length) {
                nextInput.shift();
            }
            setInput(nextInput);

            if (nextInput.join(",") === sequence.join(",")) {
                activateDoomMode();
                setInput([]);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [input]);

    const activateDoomMode = () => {
        setDoomMode(true);
        // Play sound if we had one, for now just visual
        // Add a global class to body to trigger CSS chaos
        document.documentElement.classList.add("doom-mode");

        // Show a little toast
        const toast = document.createElement("div");
        toast.className = "fixed top-10 left-1/2 -translate-x-1/2 bg-red-900 border border-red-500 text-red-100 px-6 py-4 z-[9999] font-mono font-bold animate-bounce";
        toast.innerHTML = "⚠️ SYSTEM ADMIN ACCESS GRANTED - DOOM MODE ACTIVE ⚠️";
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);
    };

    return null; // Invisible component
};
