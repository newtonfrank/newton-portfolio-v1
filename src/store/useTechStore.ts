import { create } from 'zustand';

interface TechStore {
    highlightedTechs: string[];
    setHighlightedTechs: (techs: string[]) => void;
    clearHighlight: () => void;
}

export const useTechStore = create<TechStore>((set) => ({
    highlightedTechs: [],
    setHighlightedTechs: (techs) => set({ highlightedTechs: techs }),
    clearHighlight: () => set({ highlightedTechs: [] }),
}));
