<template>
  <v-dialog v-model="isOpen" max-width="400" persistent>
    <v-card class="rounded-xl border overflow-hidden">
      <!-- Overlay Loading State -->
      <AppOverlayLoading
        :loading="loading"
        :text="loadingText"
        :color="color"
      />

      <v-card-title class="px-6 pt-6 pb-0">
        <div class="d-flex align-center justify-center w-100">
          <div class="d-flex flex-column align-center ga-3">
            <!-- Double Wrapper Icon -->
            <div 
              class="d-flex align-center justify-center rounded-circle" 
              :style="`width: 80px; height: 80px; background-color: rgba(var(--v-theme-${color}), 0.08);`"
            >
              <div 
                class="d-flex align-center justify-center rounded-circle" 
                :style="`width: 52px; height: 52px; background-color: rgba(var(--v-theme-${color}), 0.15);`"
              >
                <v-icon :icon="icon" size="28" :color="color"></v-icon>
              </div>
            </div>
            <div>
              <div class="text-h6 font-weight-bold">{{ title }}</div>
            </div>
          </div>
        </div>
      </v-card-title>
      
      <v-card-text class="px-6 pt-2 pb-6 text-body-2 text-center text-medium-emphasis" style="line-height: 1.5;">
        {{ message }}

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-4 text-caption"
        >
          {{ error }}
        </v-alert>
      </v-card-text>

      <div class="px-6 pb-6 pt-3 d-flex justify-center ga-3">
        <v-btn variant="tonal" width="130" color="secondary" rounded="pill" @click="onCancel" class="px-6 font-weight-bold">
          {{ cancelText }}
        </v-btn>
        <v-btn 
          :color="color" 
          variant="flat" 
          rounded="pill" 
          width="130"
          @click="onConfirm"
          class="px-6 font-weight-bold"
          :loading="loading"
        >
          {{ confirmText }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, default: 'Apakah Anda yakin?' },
  icon: { type: String, default: 'tabler-alert-triangle' },
  color: { type: String, default: 'error' },
  confirmText: { type: String, default: 'Hapus' },
  cancelText: { type: String, default: 'Batal' },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: 'Memproses...' },
  error: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function onCancel() {
  isOpen.value = false
  emit('cancel')
}

function onConfirm() {
  emit('confirm')
}
</script>
