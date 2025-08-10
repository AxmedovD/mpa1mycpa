<template>
  <svg 
    class="ml-1 w-3 h-3"
    :class="{
      'text-gray-400': !active,
      'text-blue-500': active
    }"
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      v-if="direction === 'asc'" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M5 15l7-7 7 7"
    />
    <path 
      v-else 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M19 9l-7 7-7-7"
    />
  </svg>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  },
  direction: {
    type: String,
    default: 'desc',
    validator: (value) => ['asc', 'desc'].includes(value)
  }
})
</script>
