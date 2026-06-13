# NuxDash

> Nuxt 4 + Vuetify 3 + Tailwind CSS v4 Dashboard

## Tech Stack

- **Nuxt 4** — Vue 3 framework with `app/` directory structure
- **Vuetify 3** — via `vuetify-nuxt-module` (auto-import components & composables)
- **Tailwind CSS v4** — via `@tailwindcss/vite`
- **ApexCharts** — via `vue3-apexcharts` (area, bar, donut charts)
- **Material Design Icons** — `@mdi/font`

## Features

- 📊 Interactive charts (area, bar, donut)
- 🎨 Custom theme (primary, secondary, accent colors)
- 🌗 Dark / Light mode toggle (persisted to localStorage)
- 🎨 6 preset themes + color pickers
- 🗂️ Collapsible sidebar navigation
- 📱 Responsive layout
- ⚡ Auto-import Vuetify components & composables

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── assets/
│   ├── css/main.css         # Tailwind CSS entry
│   └── settings.scss        # Vuetify SASS overrides
├── composables/
│   └── useAppTheme.ts       # Theme management composable
├── layouts/
│   └── default.vue          # Sidebar + topbar layout
├── pages/
│   ├── index.vue            # Dashboard (charts, stats, tables)
│   ├── settings.vue         # Theme customizer
│   ├── analytics.vue
│   ├── orders.vue
│   ├── customers.vue
│   ├── products.vue
│   └── reports.vue
├── plugins/
│   └── apexcharts.client.ts # ApexCharts registration
└── app.vue
nuxt.config.ts               # Nuxt + Vuetify + Tailwind config
```
