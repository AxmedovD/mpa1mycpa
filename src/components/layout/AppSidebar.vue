<script setup>
import { ref, inject, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SidebarNavItem from './sidebar/SidebarNavItem.vue'
import { sidebarMenuItems } from '../../config/navigation'
import auth from '../../stores/auth'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:isOpen'])
const isMobile = inject('isMobile')

// Get user role from auth store
const userType = computed(() => auth.user.value?.type || '')
const isSuperAdmin = computed(() => auth.isSuperAdmin)
const isAdmin = computed(() => auth.isAdmin)
const isMsAdmin = computed(() => auth.isMsAdmin)

// Filter menu items based on user role permissions
const filteredMenuItems = computed(() => {
  return sidebarMenuItems.filter(item => {
    // Check if user role is in the allowed roles for this menu item
    if (item.allowedRoles && !item.allowedRoles.includes(userType.value)) {
      return false
    }
    return true
  }).map(item => {
    // Also filter children items if present
    if (item.children) {
      return {
        ...item,
        children: item.children.filter(child => {
          if (child.allowedRoles && !child.allowedRoles.includes(userType.value)) {
            return false
          }
          return true
        })
      }
    }
    return item
  }).filter(item => {
    // Remove parent items with no visible children
    if (item.children && item.children.length === 0) {
      return false
    }
    return true
  })
})

const toggleSidebar = () => {
  emit('update:isOpen', !props.isOpen)
}
</script>

<template>
  <aside 
    :class="[
      'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-20',
      isOpen ? 'translate-x-0 w-64' : isMobile ? '-translate-x-full w-64' : 'w-20',
    ]"
  >
    <button 
      @click="toggleSidebar"
      class="absolute -right-3 top-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-1.5 shadow-lg transition-colors duration-200 hidden md:block"
    >
      <svg 
        :class="['w-4 h-4 transition-transform duration-300', isOpen ? 'rotate-180' : '']"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <nav class="mt-8 px-4">
      <ul class="space-y-2">
        <SidebarNavItem
          v-for="item in filteredMenuItems"
          :key="item.name"
          :item="item"
          :is-sidebar-open="isOpen"
          @update:is-sidebar-open="value => emit('update:isOpen', value)"
        />
      </ul>
    </nav>
  </aside>
</template>