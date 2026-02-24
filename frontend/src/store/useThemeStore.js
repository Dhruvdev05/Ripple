import { create } from 'zustand'

export const useThemeStore = create((set) => ({

    theme: localStorage.getItem("ripple-theme") || "forest",
    setTheme: (theme) => {
        localStorage.setItem("ripple-theme" , theme)
        set({ theme })
    },
}))