<template>
  <v-dialog v-model="isOpen" max-width="700" persistent>
    <v-card class="rounded-xl border">
      <v-card-title class="px-6 pt-6 pb-2">
        <div class="d-flex align-start justify-space-between w-100">
          <div class="d-flex align-center ga-4">
            <v-avatar color="primary" variant="tonal" rounded="lg" size="40">
              <v-icon icon="tabler-file-plus" size="24"></v-icon>
            </v-avatar>
            <div>
              <h2 class="text-subtitle-1 font-weight-bold text-on-surface mb-0" style="line-height: 1.2;">New Request</h2>
              <div class="text-caption text-medium-emphasis" style="white-space: normal;">
                Silakan lengkapi nama proyek dan judul dokumen yang ingin Anda ajukan.
              </div>
            </div>
          </div>
          <!-- <v-btn icon="tabler-x" variant="text" density="comfortable" @click="closeDialog" class="ml-2 mt-n1"></v-btn> -->
        </div>
      </v-card-title>

      <v-divider class="mt-2"/>
      
      <v-card-text class="px-6 pb-6 pt-4">
        <v-form ref="formRef" v-model="valid" @submit.prevent="onSubmit">
          <AppTextField
            v-model="formData.projectName"
            :rules="[rules.required, rules.minLength]"
            label="Project Name"
            placeholder="Contoh: Aplikasi E-Commerce"
            required
            class="mb-4"
          />

          <AppTextField
            v-model="formData.documentTitle"
            :rules="[rules.required, rules.minLength]"
            label="Document Title"
            placeholder="Contoh: User Requirement Specification"
            required
            class="mb-6"
          />

          <div class="d-flex flex-column flex-sm-row justify-end align-stretch align-sm-center ga-3 w-100 mt-2">
            <v-btn variant="tonal" color="secondary" rounded="pill" @click="closeDialog" class="px-6 font-weight-bold">
              Batal
            </v-btn>
            <v-btn 
              type="submit" 
              color="primary" 
              variant="flat" 
              :disabled="!formData.documentTitle || !formData.projectName"
              rounded="pill" 
              class="px-6 font-weight-bold"
              :loading="store.loading"
            >
              Submit
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDocumentStore } from '~/stores/document.store'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const store = useDocumentStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const valid = ref(false)
const formRef = ref<any>(null)
const formData = ref({
  projectName: '',
  documentTitle: ''
})

const rules = {
  required: (v: string) => !!v || 'Wajib diisi',
  minLength: (v: string) => (v && v.length >= 3) || 'Minimal 3 karakter'
}

function closeDialog() {
  isOpen.value = false
  if (formRef.value) formRef.value.reset()
}

async function onSubmit() {
  if (!formRef.value) return
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const success = await store.createDocument(formData.value)
  if (success) {
    closeDialog()
  }
}
</script>
