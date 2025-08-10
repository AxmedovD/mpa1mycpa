<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const logoClasses = computed(() => ({
  'justify-center w-20': !props.isOpen,
  'w-64': props.isOpen
}))
</script>

<template>
  <div 
    class="fixed top-0 left-0 h-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex items-center transition-all duration-300 z-20"
    :class="logoClasses"
  >
    <div class="px-4 flex items-center">
      <span 
        class="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text"
        :class="{ 'text-3xl': !isOpen }"
      >
        WMS
      </span>
      <span 
        v-if="isOpen"
        class="ml-2 text-sm text-gray-600 dark:text-gray-400 font-medium"
      >
        Mgoods
      </span>
    </div>
  </div>
</template>