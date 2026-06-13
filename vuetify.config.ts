import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#FA1E59", // rgb(250, 30, 89)
          "primary-darken-1": "#C4154A", // rgb(196, 21, 74)
          secondary: "#14213D", // rgb(20, 33, 61)
          accent: "#EC4899",
          error: "#EF4444",
          info: "#3B82F6",
          success: "#10B981",
          warning: "#F59E0B",
          background: "#F8FAFC",
          surface: "#FFFFFF",
          "on-background": "#14213D", // Mengganti warna teks utama
          "on-surface": "#14213D", // Mengganti warna teks di atas card/permukaan
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#FA1E59",
          "primary-darken-1": "#C4154A",
          secondary: "#64748B", // Slate 500
          accent: "#F472B6",
          error: "#F87171",
          info: "#60A5FA",
          success: "#34D399",
          warning: "#FBBF24",
          background: "#0F172A", // Slate 900
          surface: "#1E293B", // Slate 800
          "on-background": "#F8FAFC",
          "on-surface": "#F1F5F9",
        },
      },
    },
  },
  icons: {
    defaultSet: "tabler",
  },
})
