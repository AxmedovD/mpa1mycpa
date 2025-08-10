<template>
  <span 
    :class="[
      'px-2 py-1 text-sm font-medium rounded-md',
      STORAGE_TYPES[type]?.colorClass
    ]"
  >
    {{ STORAGE_TYPES[type]?.label }}
  </span>
</template>

<script setup>
import { STORAGE_TYPES } from '../../utils/storageTypes'

defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['income', 'outcome', 'enter', 'loss'].includes(value)
  }
})
</script>