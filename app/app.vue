<template>
  <div>
    <!-- Initial Loading Overlay -->
    <transition name="fade">
      <div v-if="isLoading" class="initial-loader">
        <div class="loader-content">
          <div class="css-loader"></div>
          <div class="loader-text">Memuat Data...</div>
        </div>
      </div>
    </transition>

    <!-- Main App Layout -->
    <div v-show="!isLoading">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isLoading = ref(true);

onMounted(() => {
  // Berikan sedikit jeda untuk memastikan seluruh CSS Vuetify & Tailwind selesai di-inject
  setTimeout(() => {
    isLoading.value = false;
  }, 400); 
});
</script>

<style scoped>
.initial-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  z-index: 99999;
}

@media (prefers-color-scheme: dark) {
  .initial-loader {
    background-color: #0F172A;
  }
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loader-text {
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  color: rgb(var(--v-theme-primary));
  font-size: 14px;
  letter-spacing: 0.5px;
}

.css-loader {
  border: 4px solid rgba(var(--v-theme-primary), 0.2);
  border-left-color: rgb(var(--v-theme-primary));
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Transisi fade-out untuk loader */
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>
