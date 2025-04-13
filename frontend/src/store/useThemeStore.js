import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme-preferred") || "forest",
  setTheme: (theme) => {
    localStorage.setItem("theme-preferred", theme);
    set({ theme });
  },
}));
