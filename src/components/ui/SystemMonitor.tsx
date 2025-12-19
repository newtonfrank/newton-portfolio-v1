"use client";

import React, { useState, useEffect, useRef } from "react";

export const SystemMonitor = () => {
    const [time, setTime] = useState("");
    const [fps, setFps] = useState(0);
    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    const [location, setLocation] = useState("LOCATING...");

    // Time Updater
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        const interval = setInterval(updateTime, 1000);
        updateTime();
        return () => clearInterval(interval);
    }, []);

    // FPS Counter
    useEffect(() => {
        let requestID: number;
        const loop = () => {
            const now = performance.now();
            frameCount.current++;
            if (now - lastTime.current >= 1000) {
                setFps(frameCount.current);
                frameCount.current = 0;
                lastTime.current = now;
            }
            requestID = requestAnimationFrame(loop);
        };
        requestID = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(requestID);
    }, []);

    // Mock Location (or real if API key exists)
    useEffect(() => {
        // Simulating a lookup
        setTimeout(() => {
            setLocation("BANGALORE, IN");
        }, 2000);
    }, []);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-2 bg-black/80 backdrop-blur-md border-t border-white/10 text-[10px] font-mono text-neutral-500 uppercase tracking-widest hidden md:flex">
            {/* Left: Location & Weather */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-cyan-500">CONN:</span> {location}
                </div>
                <div className="flex items-center gap-2">
                    <span>WS:</span> 24°C // HAZE
                </div>
            </div>

            {/* Center: System */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-50">
                <span>SYS.VER.2.0.4</span>
                <span>//</span>
                <span>REACT_CORE_ACTIVE</span>
            </div>

            {/* Right: Time & FPS */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-cyan-500">GPU:</span> {fps} FPS
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-cyan-500">LOC.TIME:</span> {time}
                </div>
            </div>
        </div>
    );
};
