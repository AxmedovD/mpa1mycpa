<script setup>
import { provide, ref, watch } from 'vue'
import AppHeader from '../components/layout/AppHeader.vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import SidebarLogo from '../components/layout/sidebar/SidebarLogo.vue'
import { useResponsiveSidebar } from '../composables/useResponsiveSidebar'

const { isSidebarOpen, isMobile } = useResponsiveSidebar()
provide('isSidebarOpen', isSidebarOpen)
provide('isMobile', isMobile)

// Add overlay ref and click handler
const handleOverlayClick = () => {
  if (isMobile.value) {
    isSidebarOpen.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
    <!-- Add overlay div for mobile -->
    <div
      v-if="isMobile && isSidebarOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 z-10"
      @click="handleOverlayClick"
    ></div>

    <SidebarLogo :is-open="isSidebarOpen" />
    <AppHeader />
    <AppSidebar v-model:is-open="isSidebarOpen" />
    
    <main 
      class="pt-16 flex-grow transition-all duration-300"
      :class="[isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0 md:ml-20']"
    >
      <div class="h-full w-full px-4 sm:px-6 lg:px-8">
        <div class="max-w-full mx-auto mt-6">
          <router-view></router-view>
        </div>
      </div>
    </main>
    
    <AppFooter />
  </div>
</template>