<template>
  <v-dialog v-model="isOpen" max-width="500" scrollable>
    <v-card class="rounded-xl border pt-6 pb-5 px-6">
      <v-btn icon="tabler-x" variant="text" density="comfortable" @click="closeDialog" class="position-absolute text-medium-emphasis" style="top: 12px; right: 12px; z-index: 2;"></v-btn>
      
      <!-- Header -->
        <!-- Loading State -->
      <template v-if="loading">
        <v-card-text class="d-flex flex-column align-center justify-center py-10" style="min-height: 200px;">
          <v-progress-circular indeterminate color="primary" size="48" width="4"></v-progress-circular>
          <div class="mt-4 text-body-2 text-medium-emphasis">Mengambil detail dokumen...</div>
        </v-card-text>
      </template>
      <template v-else-if="!loading">
      <v-card-title class="px-6 pt-6 pb-4 position-relative">
        <div class="d-flex align-center justify-center w-100">
          <div class="d-flex flex-column align-center ga-3">
            <!-- Double Wrapper Icon -->
            <div 
              class="d-flex align-center justify-center rounded-circle" 
              style="width: 80px; height: 80px; background-color: rgba(var(--v-theme-primary), 0.08);"
            >
              <div 
                class="d-flex align-center justify-center rounded-circle" 
                style="width: 52px; height: 52px; background-color: rgba(var(--v-theme-primary), 0.15);"
              >
                <v-icon icon="tabler-file-info" size="28" color="primary"></v-icon>
              </div>
            </div>
            <div class="text-center">
              <h2 class="text-h6 font-weight-bold mb-0" style="line-height: 1.2;">Document Detail</h2>
              <div class="text-caption text-medium-emphasis mt-1" style="white-space: normal;">
                Informasi lengkap dokumen pengajuan
              </div>
            </div>
          </div>
        </div>
      </v-card-title>

      <!-- Error State -->
      <template v-if="error">
        <v-card-text class="d-flex flex-column align-center justify-center py-10" style="min-height: 200px;">
          <v-icon icon="tabler-alert-circle" size="48" color="error" class="mb-4"></v-icon>
          <div class="text-body-1 font-weight-bold text-error mb-2">Gagal Memuat Detail</div>
          <div class="text-body-2 text-medium-emphasis text-center px-4">{{ error }}</div>
        </v-card-text>
      </template>

      <!-- Content State -->
      <template v-else-if="document">
        <v-card-text class="px-6 py-4" style="max-height: 60vh; min-height: 200px;">
          <v-row class="mt-1">
            <!-- Project Name -->
            <v-col cols="12" sm="6" lg="6" class="mb-2">
              <div class="text-xs text-medium-emphasis tracking-widest">Project Name</div>
              <div class="text-body-2 font-weight-medium text-on-surface">{{ document.projectName }}</div>
            </v-col>
            
            <!-- Document Title -->
            <v-col cols="12" sm="6" lg="6" class="mb-2">
              <div class="text-xs text-medium-emphasis tracking-widest">Document Title</div>
              <div class="text-body-2 font-weight-medium">{{ document.documentTitle }}</div>
            </v-col>

            <!-- Status -->
            <v-col cols="12" sm="6" lg="6" class="mb-2">
              <div class="text-xs text-medium-emphasis tracking-widest">Current Status</div>
              <v-chip :color="getStatusColor(document.status)" size="small" class="font-weight-bold text-uppercase px-3">
                {{ document.status.replace('_', ' ') }}
              </v-chip>
            </v-col>

            <!-- Submitted By -->
            <v-col cols="12" sm="6" lg="6" class="mb-2">
              <div class="text-xs text-medium-emphasis tracking-widest">Submitted By</div>
              <div class="text-body-2 font-weight-medium">{{ document.submittedBy || '-' }}</div>
            </v-col>

            <!-- Submission Date -->
            <v-col cols="12" sm="6" lg="6">
              <div class="text-xs text-medium-emphasis  tracking-widest">Submission Date</div>
              <div class="text-body-2 font-weight-medium">{{ formatDate(document.createAt) }}</div>
            </v-col>
            
            <!-- Last Updated -->
            <v-col cols="12" sm="6" lg="6">
              <div class="text-xs text-medium-emphasis tracking-widest">Last Updated</div>
              <div class="text-body-2 font-weight-medium">{{ formatDate(document.updateAt) }}</div>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions class="px-6 py-4 d-flex justify-end">
          <slot name="actions" :close="closeDialog">
            <v-btn variant="flat" color="primary" rounded="pill" width="130" class="font-weight-bold" @click="closeDialog">Tutup</v-btn>
          </slot>
        </v-card-actions>
      </template>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  document: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function closeDialog() {
  isOpen.value = false;
}

function getStatusColor(status: string) {
  if (status === 'APPROVED') return 'success'
  if (status === 'REJECTED') return 'error'
  return 'warning'
}

function formatDate(dateString: string) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>

<style scoped>
.tracking-widest {
  letter-spacing: 0.05em;
}
</style>
