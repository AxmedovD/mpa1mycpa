<script setup>
import { inject } from 'vue'
import { useAuth } from '../../stores/auth'
import ThemeToggle from '../ThemeToggle.vue'
import UserProfile from './UserProfile.vue'
import SearchBar from './header/SearchBar.vue'

const auth = useAuth()
const isSidebarOpen = inject('isSidebarOpen')
const isMobile = inject('isMobile')

const handleSearch = (query) => {
  console.log('Search query:', query)
}
</script>

<template>
  <header 
    class="fixed top-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 transition-all duration-300 h-16"
    :class="[
      isSidebarOpen && !isMobile ? 'left-64' : 'left-0 md:left-20'
    ]"
  >
    <div class="h-full w-full px-4 sm:px-6 lg:px-8">
      <div class="h-full flex items-center justify-between">
        <div class="flex items-center flex-1">
          <!-- Mobile menu button -->
          <button
            v-if="isMobile"
            @click="isSidebarOpen = !isSidebarOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mr-2 flex-shrink-0"
          >
            <span class="sr-only">Open sidebar</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isSidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="flex-1 min-w-0">
            <SearchBar @search="handleSearch" />
          </div>
        </div>

        <div class="flex items-center space-x-4 ml-4 flex-shrink-0">
          <ThemeToggle />
          <UserProfile />
        </div>
      </div>
    </div>
  </header>
</template>