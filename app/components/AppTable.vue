<template>
  <v-card class="rounded-xl elevation-3 border global-table-card">
    <!-- Header: Title and Actions -->
    <div v-if="title || $slots.actions" class="d-flex align-center justify-space-between px-4 py-3">
      <div class="d-flex align-center ga-3">
        <v-avatar v-if="icon" color="primary" variant="tonal" rounded="lg" size="40">
          <v-icon :icon="icon" size="24"></v-icon>
        </v-avatar>
        <div>
          <h2 v-if="title" class="text-subtitle-1 font-weight-bold text-on-surface mb-0" style="line-height: 1.2;">{{
            title }}</h2>
          <div v-if="subtitle" class="text-caption text-medium-emphasis">{{ subtitle }}</div>
        </div>
      </div>

      <!-- Actions Button -->
      <div class="d-flex align-center ga-2">
        <slot name="actions"></slot>
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Toolbar: Items per page and Search -->
    <v-toolbar color="transparent" class="px-4 py-2" flat>
      <div class="d-flex align-center">
        <v-select v-model="internalItemsPerPage" :items="[5, 10, 25, 50]" variant="outlined" color="primary"
          density="compact" hide-details style="max-width: 90px" menu-icon="tabler-chevron-down"></v-select>
      </div>
      <v-spacer></v-spacer>

      <!-- Slot for extra toolbar actions (e.g. Filters) -->
      <slot name="toolbar-actions"></slot>

      <v-text-field v-if="showSearch" v-model="internalSearch" prepend-inner-icon="tabler-search"
        placeholder="Cari berdasarkan judul..." density="compact" hide-details variant="outlined" color="primary"
        class="max-w-xs ml-4" @update:model-value="onSearch"></v-text-field>
    </v-toolbar>

    <v-divider></v-divider>

    <!-- Data Table Server -->
    <v-data-table-server v-model:page="internalPage" v-model:items-per-page="internalItemsPerPage" :headers="headers"
      :items="items" :items-length="totalItems" :loading="loading" @update:options="onOptionsUpdate"
      class="bg-transparent" density="comfortable" hover>
      <!-- Dynamic Slots passthrough -->
      <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps || {}"></slot>
      </template>

      <!-- Fallback Loading View -->
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
      </template>

      <!-- No Data View -->
      <template v-slot:no-data>
        <div class="pa-8 text-center text-medium-emphasis">
          <v-icon icon="tabler-database-off" size="64" class="mb-4 opacity-50"></v-icon>
          <div class="text-h6">Tidak ada data ditemukan</div>
        </div>
      </template>

      <!-- Custom Pagination Footer -->
      <template v-slot:bottom>
        <v-divider></v-divider>
        <div class="d-flex align-center justify-space-between pa-4 flex-wrap ga-4">
          <span class="text-body-2 text-medium-emphasis">
            Showing {{ startIndex }} to {{ endIndex }} of {{ totalItems }} entries
          </span>

          <v-pagination v-model="internalPage" :length="pageCount" :total-visible="5" active-color="primary"
            density="compact" rounded="circle"></v-pagination>
        </div>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Data Table' },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: '' },
  headers: { type: Array as () => any[], required: true },
  items: { type: Array as () => any[], required: true },
  totalItems: { type: Number, required: true },
  loading: { type: Boolean, default: false },
  showSearch: { type: Boolean, default: true },
  itemsPerPage: { type: Number, default: 10 }
})

const emit = defineEmits(['update:options', 'search'])

const internalSearch = ref('')
const internalPage = ref(1)
const internalItemsPerPage = ref(props.itemsPerPage)

let searchTimeout: any = null

const pageCount = computed(() => {
  return Math.max(1, Math.ceil(props.totalItems / internalItemsPerPage.value))
})

const startIndex = computed(() => {
  if (props.totalItems === 0) return 0
  return (internalPage.value - 1) * internalItemsPerPage.value + 1
})

const endIndex = computed(() => {
  return Math.min(internalPage.value * internalItemsPerPage.value, props.totalItems)
})

function onSearch(val: string) {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    // Reset page to 1 when searching
    internalPage.value = 1
    emit('search', val)
  }, 500) // Debounce search 500ms agar tidak spam API
}

function onOptionsUpdate(options: any) {
  // Vuetify 3 options object contains { page, itemsPerPage, sortBy, groupBy, search }
  emit('update:options', options)
}
</script>

<style scoped>
.max-w-xs {
  max-width: 300px;
}

.global-table-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.08), 0 0 4px rgba(0, 0, 0, 0.04) !important;
}

/* Custom styling for table headers */
:deep(.v-data-table-header th) {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  white-space: nowrap;
}

/* Hover effect on rows */
:deep(.v-data-table__tr) {
  transition: background-color 0.2s ease;
}

:deep(.v-data-table__tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
}
</style>
