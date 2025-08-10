<script setup>
import { inject } from 'vue'
import FooterContent from './footer/FooterContent.vue'

const isSidebarOpen = inject('isSidebarOpen')
const isMobile = inject('isMobile')
</script>

<template>
  <footer 
    class="bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 h-16 mt-8"
    :class="[
      isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0 md:ml-20'
    ]"
  >
    <FooterContent />
  </footer>
</template>