<template>
  <v-overlay
    :model-value="loading"
    :contained="contained"
    class="align-center justify-center"
    opacity="1"
    scrim="white"
    v-bind="$attrs"
  >
    <div class="d-flex flex-column align-center">
      <v-progress-circular
        :color="color"
        indeterminate
        size="48"
        width="4"
      ></v-progress-circular>
      <div v-if="text" class="mt-3 text-body-2 text-medium-emphasis">
        {{ text }}
      </div>
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: 'Memproses...'
  },
  color: {
    type: String,
    default: 'primary'
  },
  contained: {
    type: Boolean,
    default: true
  }
})
</script>
