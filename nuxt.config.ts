import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
        },
      ],
    },
  },
  ssr: true,
  // Nuxt 4 — compatibilityDate matches Nuxt 4 release
  compatibilityDate: "2025-07-15",

  runtimeConfig: {
    // Variabel ini hanya bisa diakses di server-side API (Nitro)
    jwtSecret: process.env.JWT_SECRET || "fallback_secret_if_env_missing",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
    
    // Variabel dalam public dapat diakses baik di server maupun client-side
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api",
    }
  },

  modules: ["vuetify-nuxt-module", "@pinia/nuxt"],

  vuetify: {
    moduleOptions: {
      importComposables: true,
      styles: {
        configFile: "assets/scss/settings.scss",
      },
    },
    vuetifyOptions: "./vuetify.config.ts",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  css: [
    "~/assets/css/tailwind.css",
    "~/assets/scss/main.scss",
  ],

  features: {
    inlineStyles: false,
  },
});
