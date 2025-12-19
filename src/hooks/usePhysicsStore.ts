import { create } from 'zustand';

interface PhysicsState {
    gravity: { x: number; y: number };
    timeScale: number;
    isPaused: boolean;
    cameraZ: number;

    setGravity: (x: number, y: number) => void;
    setTimeScale: (scale: number) => void;
    setPaused: (paused: boolean) => void;
    setCameraZ: (z: number) => void;
}

export const usePhysicsStore = create<PhysicsState>((set) => ({
    gravity: { x: 0, y: 0 }, // Zero-G by default
    timeScale: 1,
    isPaused: false,
    cameraZ: 0,

    setGravity: (x, y) => set({ gravity: { x, y } }),
    setTimeScale: (scale) => set({ timeScale: scale }),
    setPaused: (paused) => set({ isPaused: paused }),
    setCameraZ: (z) => set({ cameraZ: z }),
}));
