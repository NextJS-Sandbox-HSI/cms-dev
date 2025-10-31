import { create } from "zustand";

interface CommandPaletteStore {
  isOpen: boolean;
  setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

export const useCommandPalette = create<CommandPaletteStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) =>
    set((state) => ({
      isOpen: typeof open === "function" ? open(state.isOpen) : open,
    })),
}));
