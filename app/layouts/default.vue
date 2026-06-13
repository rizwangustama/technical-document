<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCookie } from '#app'
import { useDisplay } from 'vuetify'

const { isDark, toggleTheme, loadSavedColors } = useAppTheme();
const currentPageTitle = usePageTitle();
const router = useRouter();
const { mobile } = useDisplay();

const drawer = ref(true);
const rail = ref(false);

const authUser = useCookie<any>('auth_user')
const authToken = useCookie('auth_token')

const userName = computed(() => authUser.value?.name || 'User')
const userEmail = computed(() => authUser.value?.email || 'user@example.com')
const userInitials = computed(() => {
  const name = authUser.value?.name || 'User'
  return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
})

function handleLogout() {
  authUser.value = null
  authToken.value = null
  router.push('/login')
}

onMounted(() => {
  loadSavedColors();
  if (mobile.value) {
    drawer.value = false;
  }
});
</script>

<style scoped lang="scss">
@use '../assets/scss/layouts/default';
</style>


<template>
  <v-app :theme="isDark ? 'dark' : 'light'">

    <!-- Navigation Drawer (Sidebar) -->
    <v-navigation-drawer v-model="drawer" :rail="rail" :permanent="!mobile" :color="isDark ? 'surface' : 'white'"
      :class="['sidebar-drawer text-secondary d-none d-md-flex flex-column', { 'is-expanded': !rail }]" elevation="0">
      <!-- Logo / Brand -->
      <v-list-item :class="rail ? 'px-2 py-4 d-flex justify-center' : 'px-4 py-4'">
        <template #prepend>
          <div class="brand-icon" :class="{ 'mr-3': !rail }">
            <img :src="'/images/logo.png'" alt="Logo" style="width: 32px; height: 32px; object-fit: contain;" />
          </div>
        </template>
        <template v-if="!rail">
          <v-list-item-title class="text-subtitle-2 font-weight-bold brand-text text-wrap" style="line-height: 1.2;">
            Management Document 
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption text-medium-emphasis font-weight-medium" style="line-height: 1.2;">
            Dashboard Kontruksi
          </v-list-item-subtitle>
        </template>
      </v-list-item>

      <v-divider class="mb-2" />

      <!-- Nav Items -->
      <v-list density="compact" nav :class="[rail ? 'px-2' : 'px-3', 'mt-2']">
        <v-list-item v-for="item in navItems" :key="item.title" :to="item.to" :prepend-icon="item.icon"
          :title="item.title" :rounded="rail ? 'circle' : 'pill'" class="nav-item mb-1" active-class="active-gradient">
          <template #append>
            <v-chip v-if="item.badge && !rail" size="x-small" color="error" variant="flat"
              class="mr-1 font-weight-medium">
              {{ item.badge }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>

      <template #append>
        <v-divider />
        <v-list density="compact" nav :class="[rail ? 'px-2' : 'px-3', 'py-3']">
          <v-list-item :prepend-icon="rail ? 'tabler-chevron-right' : 'tabler-chevron-left'"
            :title="!rail ? 'Collapse Sidebar' : undefined" :rounded="rail ? 'circle' : 'pill'"
            class="nav-item text-white bg-primary" @click="rail = !rail" />
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- Top App Bar -->


    <v-app-bar color="transparent" elevation="0" class="page-wrapper" :style="mobile ? 'padding-left: 0px!important' : 'padding-right: 24px !important;'">
      <v-container fluid class="py-0">
        <VCard rounded="xl" elevation="0" border class="w-100">
          <VCardText class="py-3 px-3 px-sm-4">

        <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <span class="text-body-1 font-weight-medium ml-1 text-secondary text-truncate" style="max-width: 150px; display: inline-block;">
              {{ currentPageTitle }}
            </span>
          </div>
          <div class="d-flex align-center ga-1 ga-sm-2">
            <!-- Search -->
            <v-btn icon="tabler-search" variant="text" size="small" />

            <!-- Notifications -->
            <v-btn variant="text" size="small" icon>
              <v-badge content="3" color="error" floating>
                <v-icon>tabler-bell</v-icon>
              </v-badge>
            </v-btn>

            <!-- Theme toggle -->
            <v-btn :icon="isDark ? 'tabler-sun' : 'tabler-moon'" variant="text" size="small" @click="toggleTheme" />

            <!-- Avatar with Menu -->
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-avatar v-bind="props" size="36" color="primary" class="cursor-pointer ml-1">
                <span class="text-caption font-weight-bold text-white">{{ userInitials }}</span>
              </v-avatar>
            </template>
            <v-card min-width="240" rounded="xl" elevation="4" class="mt-2 py-2">
              <div class="px-4 py-2 d-flex align-center ga-3">
                <v-avatar color="primary" variant="tonal" size="40">
                  <span class="text-body-2 font-weight-bold">{{ userInitials }}</span>
                </v-avatar>
                <div>
                  <div class="text-body-2 font-weight-bold">{{ userName }}</div>
                  <div class="text-caption text-medium-emphasis">{{ userEmail }}</div>
                </div>
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="px-3 py-1">
                <v-btn
                  color="primary"
                  variant="flat"
                  rounded="pill"
                  block
                  class="justify-start px-3 rounded-lg text-none font-weight-medium"
                  prepend-icon="tabler-logout"
                  @click="handleLogout"
                >
                  Sign Out
                </v-btn>
              </div>
            </v-card>
          </v-menu>
          </div>
        </div>
            </VCardText>
                </VCard>

      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="main-content">
      <div class="page-wrapper">
        <NuxtPage />
      </div>
    </v-main>

    <!-- Bottom Navigation (Mobile Only) -->
    <v-bottom-navigation :bg-color="isDark ? 'surface' : 'white'" grow color="primary" class="d-md-none">
      <v-btn v-for="item in navItems" :key="item.title" :to="item.to" :value="item.to">
        <v-icon>{{ item.icon }}</v-icon>
        <span>{{ item.title }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>
