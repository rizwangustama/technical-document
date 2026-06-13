<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">Settings & Theme</h1>
      <p class="text-body-2 text-medium-emphasis">
        Customize your dashboard appearance and preferences.
      </p>
    </div>

    <v-row>
      <!-- Theme Mode -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" border class="mb-4 glass liquid-shadow">
          <v-card-item class="px-5 pt-5 pb-0">
            <v-card-title class="text-body-1 font-weight-semibold">Appearance Mode</v-card-title>
            <v-card-subtitle>Choose your preferred display mode</v-card-subtitle>
          </v-card-item>
          <v-card-text class="pa-5">
            <div class="d-flex ga-3">
              <!-- Light Mode -->
              <div
                class="mode-card"
                :class="{ active: !isDark }"
                @click="!isDark || toggleTheme()"
              >
                <div class="mode-preview light-preview">
                  <div class="preview-sidebar" />
                  <div class="preview-content">
                    <div class="preview-bar" />
                    <div class="preview-block" />
                    <div class="preview-block short" />
                  </div>
                </div>
                <div class="d-flex align-center justify-center mt-2 ga-2">
                  <v-icon icon="tabler-sun" size="16" />
                  <span class="text-caption font-weight-medium">Light</span>
                  <v-icon v-if="!isDark" icon="tabler-circle-check" size="14" color="primary" />
                </div>
              </div>

              <!-- Dark Mode -->
              <div
                class="mode-card"
                :class="{ active: isDark }"
                @click="isDark || toggleTheme()"
              >
                <div class="mode-preview dark-preview">
                  <div class="preview-sidebar dark" />
                  <div class="preview-content dark-content">
                    <div class="preview-bar dark-bar" />
                    <div class="preview-block dark-block" />
                    <div class="preview-block short dark-block" />
                  </div>
                </div>
                <div class="d-flex align-center justify-center mt-2 ga-2">
                  <v-icon icon="tabler-moon" size="16" />
                  <span class="text-caption font-weight-medium">Dark</span>
                  <v-icon v-if="isDark" icon="tabler-circle-check" size="14" color="primary" />
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Color Customizer -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" border class="mb-4 glass liquid-shadow">
          <v-card-item class="px-5 pt-5 pb-0">
            <v-card-title class="text-body-1 font-weight-semibold">Brand Colors</v-card-title>
            <v-card-subtitle>Pick your primary and accent colors</v-card-subtitle>
          </v-card-item>
          <v-card-text class="pa-5">
            <!-- Primary Color -->
            <div class="mb-5">
              <div class="d-flex align-center justify-space-between mb-2">
                <label class="text-body-2 font-weight-medium">Primary Color</label>
                <div class="d-flex align-center ga-2">
                  <div
                    class="color-preview-dot"
                    :style="{ background: primaryColor }"
                  />
                  <code class="text-caption">{{ primaryColor }}</code>
                </div>
              </div>
              <!-- Preset swatches -->
              <div class="d-flex ga-2 flex-wrap mb-3">
                <div
                  v-for="swatch in primarySwatches"
                  :key="swatch"
                  class="color-swatch"
                  :style="{ background: swatch }"
                  :class="{ 'swatch-active': primaryColor === swatch }"
                  @click="applyColor('primary', swatch)"
                />
              </div>
              <input
                type="color"
                :value="primaryColor"
                class="color-input"
                @input="applyColor('primary', ($event.target as HTMLInputElement).value)"
              />
            </div>

            <!-- Secondary Color -->
            <div class="mb-5">
              <div class="d-flex align-center justify-space-between mb-2">
                <label class="text-body-2 font-weight-medium">Secondary Color</label>
                <div class="d-flex align-center ga-2">
                  <div
                    class="color-preview-dot"
                    :style="{ background: secondaryColor }"
                  />
                  <code class="text-caption">{{ secondaryColor }}</code>
                </div>
              </div>
              <div class="d-flex ga-2 flex-wrap mb-3">
                <div
                  v-for="swatch in secondarySwatches"
                  :key="swatch"
                  class="color-swatch"
                  :style="{ background: swatch }"
                  :class="{ 'swatch-active': secondaryColor === swatch }"
                  @click="applyColor('secondary', swatch)"
                />
              </div>
              <input
                type="color"
                :value="secondaryColor"
                class="color-input"
                @input="applyColor('secondary', ($event.target as HTMLInputElement).value)"
              />
            </div>

            <!-- Accent Color -->
            <div>
              <div class="d-flex align-center justify-space-between mb-2">
                <label class="text-body-2 font-weight-medium">Accent Color</label>
                <div class="d-flex align-center ga-2">
                  <div
                    class="color-preview-dot"
                    :style="{ background: accentColor }"
                  />
                  <code class="text-caption">{{ accentColor }}</code>
                </div>
              </div>
              <div class="d-flex ga-2 flex-wrap mb-3">
                <div
                  v-for="swatch in accentSwatches"
                  :key="swatch"
                  class="color-swatch"
                  :style="{ background: swatch }"
                  :class="{ 'swatch-active': accentColor === swatch }"
                  @click="applyColor('accent', swatch)"
                />
              </div>
              <input
                type="color"
                :value="accentColor"
                class="color-input"
                @input="applyColor('accent', ($event.target as HTMLInputElement).value)"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Preset Themes -->
      <v-col cols="12">
        <v-card rounded="xl" elevation="0" border class="glass liquid-shadow">
          <v-card-item class="px-5 pt-5 pb-0">
            <v-card-title class="text-body-1 font-weight-semibold">Preset Themes</v-card-title>
            <v-card-subtitle>Quick apply popular color schemes</v-card-subtitle>
          </v-card-item>
          <v-card-text class="pa-5">
            <div class="d-flex ga-4 flex-wrap">
              <div
                v-for="preset in presets"
                :key="preset.name"
                class="preset-card"
                @click="applyPreset(preset)"
              >
                <div
                  class="preset-preview"
                  :style="{
                    background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`
                  }"
                />
                <div class="text-center mt-2">
                  <div class="text-caption font-weight-medium">{{ preset.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ preset.description }}</div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Reset -->
      <v-col cols="12">
        <v-card rounded="xl" elevation="0" border class="glass liquid-shadow">
          <v-card-text class="d-flex align-center justify-space-between pa-5">
            <div>
              <div class="text-body-2 font-weight-medium mb-1">Reset to Defaults</div>
              <div class="text-caption text-medium-emphasis">Restore all settings to the original defaults</div>
            </div>
            <v-btn
              variant="outlined"
              color="error"
              rounded="lg"
              prepend-icon="tabler-rotate-2"
              @click="resetToDefaults"
            >
              Reset
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <v-snackbar v-model="snackbar" location="bottom right" :timeout="2000" color="success" rounded="lg">
      <v-icon icon="tabler-circle-check" start />
      Theme updated successfully!
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Settings | NuxDash" });

const { isDark, toggleTheme, setColor, getColor, loadSavedColors } = useAppTheme();

const snackbar = ref(false);

const primaryColor = ref("#6366F1");
const secondaryColor = ref("#8B5CF6");
const accentColor = ref("#EC4899");

onMounted(() => {
  loadSavedColors();
  primaryColor.value = getColor("primary");
  secondaryColor.value = getColor("secondary");
  accentColor.value = getColor("accent");
});

const primarySwatches = [
  "#6366F1", "#3B82F6", "#0EA5E9", "#14B8A6", "#10B981",
  "#EAB308", "#F97316", "#EF4444", "#EC4899", "#8B5CF6",
];
const secondarySwatches = [
  "#8B5CF6", "#A78BFA", "#818CF8", "#60A5FA", "#34D399",
  "#FBBF24", "#FB923C", "#F87171", "#F472B6", "#C084FC",
];
const accentSwatches = [
  "#EC4899", "#F43F5E", "#EF4444", "#F97316", "#EAB308",
  "#22C55E", "#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6",
];

function applyColor(key: "primary" | "secondary" | "accent", value: string) {
  setColor(key, value);
  if (key === "primary") primaryColor.value = value;
  if (key === "secondary") secondaryColor.value = value;
  if (key === "accent") accentColor.value = value;
  snackbar.value = true;
}

const presets = [
  { name: "Indigo Dream", description: "Default", primary: "#6366F1", secondary: "#8B5CF6", accent: "#EC4899" },
  { name: "Ocean Breeze", description: "Cool blues", primary: "#0EA5E9", secondary: "#3B82F6", accent: "#06B6D4" },
  { name: "Emerald", description: "Fresh greens", primary: "#10B981", secondary: "#059669", accent: "#34D399" },
  { name: "Sunset", description: "Warm tones", primary: "#F97316", secondary: "#EF4444", accent: "#EAB308" },
  { name: "Rose Garden", description: "Pink bliss", primary: "#EC4899", secondary: "#F43F5E", accent: "#8B5CF6" },
  { name: "Violet Storm", description: "Deep purples", primary: "#7C3AED", secondary: "#6D28D9", accent: "#8B5CF6" },
];

function applyPreset(preset: typeof presets[0]) {
  applyColor("primary", preset.primary);
  applyColor("secondary", preset.secondary);
  applyColor("accent", preset.accent);
}

function resetToDefaults() {
  applyPreset(presets[0]);
}
</script>

<style scoped>
.mode-card {
  flex: 1;
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 16px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.mode-card:hover {
  border-color: rgb(var(--v-theme-primary));
}
.mode-card.active {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.05);
}

.mode-preview {
  border-radius: 10px;
  height: 80px;
  overflow: hidden;
  display: flex;
  background: #f1f5f9;
}
.dark-preview {
  background: #0f172a;
}

.preview-sidebar {
  width: 30%;
  background: #e2e8f0;
  height: 100%;
}
.preview-sidebar.dark {
  background: #1e293b;
}
.preview-content {
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.preview-bar {
  height: 12px;
  background: #cbd5e1;
  border-radius: 4px;
}
.dark-bar {
  background: #334155;
}
.preview-block {
  height: 20px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}
.preview-block.short {
  width: 60%;
}
.dark-block {
  background: #1e293b;
  border-color: #334155;
}

.color-preview-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(var(--v-border-color), 0.3);
  flex-shrink: 0;
}

.color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.15s ease;
  flex-shrink: 0;
}
.color-swatch:hover {
  transform: scale(1.15);
  border-color: rgba(var(--v-border-color), 0.5);
}
.swatch-active {
  border-color: rgb(var(--v-theme-on-surface)) !important;
  transform: scale(1.1);
}

.color-input {
  width: 100%;
  height: 36px;
  border-radius: 8px;
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: transparent;
  cursor: pointer;
  padding: 2px 4px;
}

.preset-card {
  width: 100px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.preset-card:hover {
  transform: scale(1.05);
}
.preset-preview {
  width: 100%;
  height: 64px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
