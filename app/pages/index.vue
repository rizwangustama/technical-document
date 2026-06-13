<template>
   <v-container fluid class="py-8">
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-4">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">Dashboard Overview</h1>
        <p class="text-body-2 text-medium-emphasis">
          Ringkasan status dokumen dan aktivitas terbaru.
        </p>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col
        v-for="stat in stats"
        :key="stat.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card rounded="xl" elevation="0" border class="h-100">
          <v-card-text class="pa-5">
            <div class="d-flex align-start justify-space-between mb-4">
              <div
                class="stat-icon-wrap"
                :style="{ background: `linear-gradient(135deg, ${stat.color}22, ${stat.color}44)` }"
              >
                <v-icon :icon="stat.icon" :color="stat.color" size="22" />
              </div>
            </div>
            <div class="text-h5 font-weight-bold mb-1">
              <v-progress-circular v-if="store.loading && !stat.value" indeterminate size="20" width="2" color="primary"></v-progress-circular>
              <span v-else>{{ stat.value }}</span>
            </div>
            <div class="text-body-2 text-medium-emphasis">{{ stat.title }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Content Row -->
    <v-row>
      <!-- Chart -->
      <v-col cols="12" lg="4">
        <v-card rounded="xl" elevation="0" border class="h-100">
          <v-card-item class="px-5 pt-5 pb-0">
            <v-card-title class="text-body-1 font-weight-bold">Status Distribution</v-card-title>
            <v-card-subtitle>Komposisi status semua dokumen</v-card-subtitle>
          </v-card-item>
          <v-card-text class="pa-5 d-flex align-center justify-center">
            <div v-if="store.summary.totalDocuments === 0 && !store.loading" class="text-body-2 text-medium-emphasis">
              Belum ada data
            </div>
            <ClientOnly v-else>
              <apexchart
                type="donut"
                height="280"
                :options="donutChartOptions"
                :series="donutSeries"
              />
            </ClientOnly>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Latest 5 Documents -->
      <v-col cols="12" lg="8">
        <v-card rounded="xl" elevation="0" border class="h-100">
          <v-card-item class="px-5 pt-5 pb-0">
            <v-card-title class="text-body-1 font-weight-bold">Latest 5 Documents</v-card-title>
            <v-card-subtitle>Pengajuan dokumen terbaru</v-card-subtitle>
          </v-card-item>
          <v-card-text class="px-0 pt-4 pb-0">
            <v-data-table
              :headers="tableHeaders"
              :items="latestDocuments"
              :loading="isFetchingList"
              hide-default-footer
              hover
              class="bg-transparent"
            >
              <template v-slot:item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small" class="font-weight-medium text-uppercase">
                  {{ item.status.replace('_', ' ') }}
                </v-chip>
              </template>
              <template v-slot:item.createAt="{ item }">
                {{ formatDate(item.createAt) }}
              </template>
              <template v-slot:no-data>
                <div class="pa-4 text-center text-medium-emphasis">Belum ada dokumen</div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useDocumentStore } from '~/stores/document.store'

useHead({ title: "Dashboard | Document Approval" });

const store = useDocumentStore()
const { isDark } = useAppTheme();

const isFetchingList = ref(false);

// Prepare Stats array based on store summary
const stats = computed(() => [
  {
    title: "Total Documents",
    value: store.summary.totalDocuments || 0,
    icon: "tabler-folders",
    color: "#6366F1",
  },
  {
    title: "Under Review",
    value: store.summary.underReview || 0,
    icon: "tabler-clock",
    color: "#F59E0B",
  },
  {
    title: "Approved",
    value: store.summary.approved || 0,
    icon: "tabler-circle-check",
    color: "#10B981",
  },
  {
    title: "Rejected",
    value: store.summary.rejected || 0,
    icon: "tabler-circle-x",
    color: "#EF4444",
  },
]);

// Prepare Chart
const donutSeries = computed(() => [
  store.summary.underReview || 0,
  store.summary.approved || 0,
  store.summary.rejected || 0
]);
const donutLabels = ["Under Review", "Approved", "Rejected"];
const donutColors = ["#F59E0B", "#10B981", "#EF4444"];

const donutChartOptions = computed(() => ({
  chart: {
    type: "donut",
    background: "transparent",
    fontFamily: "inherit",
  },
  theme: { mode: isDark.value ? "dark" : "light" },
  colors: donutColors,
  labels: donutLabels,
  legend: { position: "bottom" },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: "72%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total",
            color: isDark.value ? "#CBD5E1" : "#475569",
            formatter: () => store.summary.totalDocuments.toString(),
          },
          value: {
            color: isDark.value ? "#F1F5F9" : "#0F172A",
            fontSize: "22px",
            fontWeight: 700,
          },
        },
      },
    },
  },
  stroke: { width: 0 },
  tooltip: { theme: isDark.value ? "dark" : "light" },
}));

// Latest Documents Table
const latestDocuments = ref<any[]>([])

const tableHeaders = [
  { title: 'Project Name', key: 'projectName', sortable: false },
  { title: 'Document Title', key: 'documentTitle', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Date', key: 'createAt', sortable: false },
]

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

onMounted(async () => {
  // Fetch summary first
  await store.fetchSummary()
  
  // Fetch latest 5 documents
  isFetchingList.value = true;
  await store.fetchDocuments({ page: 1, limit: 5, sort: 'desc' })
  latestDocuments.value = store.documents.slice(0, 5)
  isFetchingList.value = false;
})
</script>

<style scoped>
.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Deep target agar tabel memakai background dari surface tema aktif */
:deep(.v-data-table) {
  background: transparent !important;
}
:deep(.v-data-table .v-data-table__thead th) {
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  /* opacity: 0.75; */
}
</style>
