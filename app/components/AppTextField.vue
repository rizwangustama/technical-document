<template>
  <div class="app-text-field-wrapper">
    <div v-if="label" class="text-body-2 mb-2 text-on-surface">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </div>
    <v-text-field
      v-model="internalValue"
      :placeholder="placeholder"
      :rules="rules"
      :type="type"
      :disabled="disabled"
      variant="outlined"
      density="compact"
      color="primary"
      hide-details="auto"
      v-bind="$attrs"
    >
      <!-- Proxy semua slot bawaan vuetify -->
      <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps || {}"></slot>
      </template>
    </v-text-field>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Non-props attributes jangan otomatis diterapkan ke root <div>, tapi kita manual pasang ke v-text-field jika dibutuhkan,
// namun secara default Vue akan pasang ke root <div>. Karena komponen ini adalah wrapper, membiarkan class turun ke root div adalah hal baik.
defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  rules: {
    type: Array as () => any[],
    default: () => []
  },
  type: {
    type: String,
    default: 'text'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped>
.app-text-field-wrapper {
  width: 100%;
}
</style>
