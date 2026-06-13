<template>
  <v-container fluid class="py-8">
    <v-row>
      <v-col cols="12">
        <AppTable
          title="Document Approval"
          subtitle="Daftar dokumen yang menunggu persetujuan Anda."
          icon="tabler-clipboard-check"
          :headers="headers"
          :items="store.documents"
          :total-items="store.totalItems"
          :loading="store.loading"
          @update:options="loadData"
          @search="onSearch"
        >
          <!-- Filter Menu (Sama dengan Document Request) -->
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
            <div class="d-flex justify-end ga-2" v-if="item.status === 'UNDER_REVIEW'">
              <v-btn color="primary" size="small" variant="tonal" class="text-caption font-weight-bold mr-2" @click="openReview(item)">Review</v-btn>
            </div>
            <div v-else class="text-caption text-medium-emphasis">
              <v-icon icon="tabler-check" v-if="item.status === 'APPROVED'" color="success"></v-icon>
              <v-icon icon="tabler-x" v-if="item.status === 'REJECTED'" color="error"></v-icon>
              Resolved
            </div>
          </template>
        </AppTable>

      </v-col>
    </v-row>

    <!-- Dialog Review -->
    <DocumentDetailDialog 
      v-model="reviewDialog" 
      :document="selectedDoc" 
      :loading="store.loading"
      :error="store.error || ''"
    >
      <template #actions="{ close }">
        <div class="d-flex ga-3 w-100 justify-end">
          <v-btn color="error" variant="tonal" rounded="pill" width="130" class="font-weight-bold" @click="rejectDocument(selectedDoc?.id)">Reject</v-btn>
          <v-btn color="success" variant="flat" rounded="pill" width="130" class="font-weight-bold" @click="approveDocument(selectedDoc?.id)">Approve</v-btn>
        </div>
      </template>
    </DocumentDetailDialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDocumentStore } from '~/stores/document.store'
import AppTable from '~/components/AppTable.vue'
import DocumentDetailDialog from '~/components/DocumentDetailDialog.vue'
import { usePageTitle } from '~/composables/usePageTitle'

usePageTitle()
const store = useDocumentStore()

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
const statusFilter = ref('UNDER_REVIEW')

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

// Approval Logic
const reviewDialog = ref(false)
const selectedDoc = ref<any>(null)

async function openReview(item: any) {
  selectedDoc.value = item
  reviewDialog.value = true
  const detail = await store.fetchDetail(item.id)
  if (detail) {
    selectedDoc.value = detail
  }
}

async function approveDocument(id: string) {
  const success = await store.updateDocument(id, { status: 'APPROVED' })
  if (success) {
    reviewDialog.value = false
    fetchData()
  }
}

async function rejectDocument(id: string) {
  const success = await store.updateDocument(id, { status: 'REJECTED' })
  if (success) {
    reviewDialog.value = false
    fetchData()
  }
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
</script>
