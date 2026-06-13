<template>
  <v-container fluid class="py-8">
    <v-row>
      <v-col cols="12">
        <AppTable
          title="Document Request"
          subtitle="Daftar pengajuan dokumen dan status persetujuannya."
          icon="tabler-file-description"
          :headers="headers"
          :items="store.documents"
          :total-items="store.totalItems"
          :loading="store.loading"
          @update:options="loadData"
          @search="onSearch"
        >
          <template #actions>
            <v-menu location="bottom end">
              <template v-slot:activator="{ props }">
                <v-btn 
                  color="secondary" 
                  prepend-icon="tabler-filter" 
                  class="font-weight-bold px-4"
                  variant="tonal"
                  rounded="pill"
                  v-bind="props"
                >
                  Filter By Status
                </v-btn>
              </template>
              <v-list density="compact" min-width="150" elevation="3" rounded="lg" class="border py-1">
                <v-list-item @click="setStatusFilter('')" :active="statusFilter === ''" color="primary">
                  <v-list-item-title class="font-weight-medium text-body-2">All Status</v-list-item-title>
                </v-list-item>
                <v-list-item @click="setStatusFilter('UNDER_REVIEW')" :active="statusFilter === 'UNDER_REVIEW'" color="primary">
                  <v-list-item-title class="font-weight-medium text-body-2">Under Review</v-list-item-title>
                </v-list-item>
                <v-list-item @click="setStatusFilter('APPROVED')" :active="statusFilter === 'APPROVED'" color="primary">
                  <v-list-item-title class="font-weight-medium text-body-2">Approved</v-list-item-title>
                </v-list-item>
                <v-list-item @click="setStatusFilter('REJECTED')" :active="statusFilter === 'REJECTED'" color="primary">
                  <v-list-item-title class="font-weight-medium text-body-2">Rejected</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn 
              color="primary" 
              prepend-icon="tabler-plus" 
              class="font-weight-bold px-4"
              variant="flat"
              rounded="pill"
              @click="dialog = true"
            >
              New Request
            </v-btn>
          </template>
          <!-- Custom Index Rendering -->
          <template v-slot:item.index="{ index }">
            <span class="font-weight-medium text-medium-emphasis">
              {{ (currentOptions.page - 1) * currentOptions.itemsPerPage + index + 1 }}
            </span>
          </template>
          <!-- Custom Status Rendering -->
          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" size="small" class="font-weight-medium text-uppercase">
              {{ item.status.replace('_', ' ') }}
            </v-chip>
          </template>
          
          <!-- Custom Date Rendering -->
          <template v-slot:item.createAt="{ item }">
            {{ formatDate(item.createAt) }}
          </template>

          <!-- Custom Actions Rendering -->
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-end">
              <v-menu location="bottom end">
                <template v-slot:activator="{ props }">
                  <v-btn icon="tabler-dots-vertical" variant="text" size="small" color="medium-emphasis" v-bind="props"></v-btn>
                </template>
                <v-list density="compact" min-width="150" elevation="3" rounded="lg" class="border py-1">
                  <v-list-item @click="openDetail(item)" class="mb-1 text-body-2">
                    <v-list-item-title>
                      <v-icon icon="tabler-eye" size="18" class="mr-2 text-info"></v-icon>
                      View Detail
                    </v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item v-if="item.status === 'UNDER_REVIEW'" @click="promptDelete(item.id)" class="text-error text-body-2">
                    <v-list-item-title>
                       <v-icon icon="tabler-trash" size="18" class="mr-2"></v-icon>
                      Hapus</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
        </AppTable>

        <!-- Dialog Form New Request (Extracted Component) -->
        <NewRequestDialog v-model="dialog" />

        <!-- Dialog View Detail -->
        <DocumentDetailDialog 
          v-model="detailDialog" 
          :document="selectedDoc" 
          :loading="store.loading"
          :error="store.error || ''"
        />

        <!-- Dialog Konfirmasi Hapus -->
        <ConfirmDialog
          v-model="deleteDialog"
          title="Delete Document"
          message="Apakah Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak dapat dibatalkan."
          icon="tabler-trash"
          color="error"
          confirm-text="Ya, Hapus"
          cancel-text="Batal"
          :loading="store.loading"
          :error="store.error || ''"
          @confirm="confirmDelete"
        />

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDocumentStore } from '~/stores/document.store'
import AppTable from '~/components/AppTable.vue'
import { usePageTitle } from '~/composables/usePageTitle'

usePageTitle()
const store = useDocumentStore()

// State untuk Dialog Form
// State untuk Dialog Form
const dialog = ref(false)

const headers = [
  { title: 'No.', key: 'index', sortable: false, width: '60px', align: 'center' as const },
  { title: 'Project Name', key: 'projectName', sortable: false, align: 'start' as const },
  { title: 'Document Title', key: 'documentTitle', sortable: false, align: 'start' as const },
  { title: 'Submitted By', key: 'submittedBy', sortable: false, align: 'start' as const },
  { title: 'Date Created', key: 'createAt', sortable: true, align: 'center' as const },
  { title: 'Status', key: 'status', sortable: false, align: 'center' as const },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const }
]

const currentOptions = ref({ page: 1, itemsPerPage: 10, sortBy: [] as any[] })
const currentSearch = ref('')
const statusFilter = ref('')

function setStatusFilter(status: string) {
  statusFilter.value = status
  currentOptions.value.page = 1
  fetchData()
}

function loadData(options: any) {
  currentOptions.value = options
  fetchData()
}

function onSearch(val: string) {
  currentSearch.value = val
  currentOptions.value.page = 1
  fetchData()
}

async function fetchData() {
  const { page, itemsPerPage, sortBy } = currentOptions.value
  let sort = 'desc'
  if (sortBy && sortBy.length > 0) {
    sort = sortBy[0].order === 'asc' ? 'asc' : 'desc'
  }

  await store.fetchDocuments({
    page,
    limit: itemsPerPage,
    search: currentSearch.value,
    status: statusFilter.value,
    sort
  })
}

function getStatusColor(status: string) {
  if (status === 'APPROVED') return 'success'
  if (status === 'REJECTED') return 'error'
  return 'warning'
}

function formatDate(dateString: string) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

// State untuk Dialog Konfirmasi Hapus
const deleteDialog = ref(false)
const docToDelete = ref<string | null>(null)

// State untuk Dialog Detail
const detailDialog = ref(false)
const selectedDoc = ref<any>(null)

async function openDetail(item: any) {
  selectedDoc.value = null // Reset previous data
  detailDialog.value = true // Open dialog immediately so loading shows
  const detail = await store.fetchDetail(item.id)
  if (detail) {
    selectedDoc.value = detail
  } else {
    // Fallback jika API gagal
    selectedDoc.value = item
  }
}

function promptDelete(id: string) {
  docToDelete.value = id
  deleteDialog.value = true
}

async function confirmDelete() {
  if (!docToDelete.value) return
  const success = await store.deleteDocument(docToDelete.value)
  if (success) {
    deleteDialog.value = false
    docToDelete.value = null
  }
}
</script>
