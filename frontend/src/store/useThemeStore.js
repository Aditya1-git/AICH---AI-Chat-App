import { create } from "zustand"

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        set({ theme });
        // also update the document root so daisyUI theme applies globally
        if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme);
    },
}))

// initialize document theme on module load
if (typeof document !== 'undefined') {
  const initial = localStorage.getItem('chat-theme') || 'coffee'
  document.documentElement.setAttribute('data-theme', initial)
}