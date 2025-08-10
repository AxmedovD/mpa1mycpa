<template>
  <span 
    v-if="tag"
    class="ml-2 px-2 py-0.5 text-xs font-medium rounded-full"
    :class="tagStyle"
  >
    {{ tag }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  kDebtId: {
    type: [String, Number, null],
    default: null
  },
  kTransactionId: {
    type: [String, Number, null],
    default: null
  },
  type: {
    type: String,
    required: true
  }
})

const tag = computed(() => {
  if (props.kDebtId) return 'Qarz'
  if (props.kTransactionId) return 'Naq'
  if (!props.kDebtId && !props.kTransactionId) {
    if (props.type === 'outcome') return 'Qaytarildi'
    if (props.type === 'income') return 'Do\'kon'
  }
  return null
})

const tagStyle = computed(() => {
  switch (tag.value) {
    case 'Qarz':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'Naq':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'Qaytarildi':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'Do\'kon':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    default:
      return ''
  }
})
</script>