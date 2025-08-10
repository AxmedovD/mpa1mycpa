<template>
  <div 
    :class="[
      'fixed inset-0 left-auto bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-50 flex flex-col md:w-[600px]',
      isOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
    :style="{ width: isMobile ? '100%' : width }"
  >
    <!-- Sticky Header -->
    <div class="sticky top-0 flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white truncate">
        <slot name="title">Form Title</slot>
      </h2>
      <button 
        @click="$emit('close')"
        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 -mr-2"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-4 md:p-6">
        <slot></slot>
      </div>
    </div>
  </div>

  <!-- Backdrop -->
  <div 
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40"
    @click="$emit('close')"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  width: {
    type: String,
    default: '600px'
  }
})

const isMobile = ref(window.innerWidth < 768)

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

defineEmits(['close'])
</script>
