export function usePageTitle() {
  const route = useRoute();
  return computed(() => pageTitles[route.path] ?? "Dashboard");
}
