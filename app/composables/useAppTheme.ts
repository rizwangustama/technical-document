/**
 * useAppTheme composable
 * Manages theme switching (light/dark) and custom color overrides
 * useTheme is auto-imported by vuetify-nuxt-module
 */


type ColorKey = "primary" | "secondary" | "accent";

export const useAppTheme = () => {
  const theme = useTheme();

  // Use cookies instead of localStorage for SSR support
  const themeCookie = useCookie<"light" | "dark">("app-theme", { default: () => "light" });
  const colorPrimary = useCookie<string>("app-color-primary");
  const colorSecondary = useCookie<string>("app-color-secondary");
  const colorAccent = useCookie<string>("app-color-accent");

  const colorMode = useState<"light" | "dark">("colorMode", () => themeCookie.value || "light");

  // Apply cookies immediately on both server and client (no onMounted needed for basic setup)
  if (themeCookie.value === "dark" || themeCookie.value === "light") {
    colorMode.value = themeCookie.value;
    theme.global.name.value = themeCookie.value;
  }

  // Also apply saved colors during setup so SSR knows about them
  if (colorPrimary.value) {
    theme.themes.value.light.colors.primary = colorPrimary.value;
    theme.themes.value.dark.colors.primary = colorPrimary.value;
  }
  if (colorSecondary.value) {
    theme.themes.value.light.colors.secondary = colorSecondary.value;
    theme.themes.value.dark.colors.secondary = colorSecondary.value;
  }
  if (colorAccent.value) {
    theme.themes.value.light.colors.accent = colorAccent.value;
    theme.themes.value.dark.colors.accent = colorAccent.value;
  }

  const isDark = computed(() => colorMode.value === "dark");

  function toggleTheme() {
    const next = isDark.value ? "light" : "dark";
    colorMode.value = next;
    theme.global.name.value = next;
    themeCookie.value = next; // Automatically syncs with cookie
  }

  function setColor(key: ColorKey, hex: string) {
    theme.themes.value.light.colors[key] = hex;
    theme.themes.value.dark.colors[key] = hex;

    if (key === "primary") colorPrimary.value = hex;
    if (key === "secondary") colorSecondary.value = hex;
    if (key === "accent") colorAccent.value = hex;
  }

  function loadSavedColors() {
    // No longer needed to manually load from localStorage on mount,
    // as cookies are loaded synchronously above.
  }

  function getColor(key: ColorKey): string {
    return theme.current.value.colors[key] ?? "#FA1E59";
  }

  return {
    isDark,
    toggleTheme,
    setColor,
    loadSavedColors,
    getColor,
    theme,
  };
};
