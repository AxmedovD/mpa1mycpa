<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isSidebarOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:isSidebarOpen'])
const route = useRoute()
const router = useRouter()
const isDropdownOpen = ref(false)

// Check if this item or any of its children is active
const isActive = computed(() => {
  if (props.item.route && route.path === props.item.route) {
    return true
  }
  
  if (props.item.children) {
    return props.item.children.some(child => route.path === child.route)
  }
  
  return false
})

const handleClick = () => {
  if (props.item.children) {
    isDropdownOpen.value = !isDropdownOpen.value
  } else if (window.innerWidth < 768) { // md breakpoint
    emit('update:isSidebarOpen', false)
  }
}

const navigateToChild = (childRoute) => {
  router.push(childRoute)
  if (window.innerWidth < 768) { // md breakpoint
    emit('update:isSidebarOpen', false)
  }
}
</script>

<template>
  <li>
    <!-- Menu item with children (dropdown) -->
    <div v-if="item.children" class="relative">
      <div
        @click="handleClick"
        class="flex items-center px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer"
        :class="[
          isActive
            ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
          !isSidebarOpen && 'justify-center'
        ]"
      >
        <svg 
          class="w-6 h-6"
          :class="{ 'mr-3': isSidebarOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
        </svg>
        <transition
          enter-active-class="transition-opacity duration-200"
          leave-active-class="transition-opacity duration-200"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div v-if="isSidebarOpen" class="flex-1 flex items-center justify-between">
            <span class="font-medium">{{ item.name }}</span>
            <svg 
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': isDropdownOpen }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </transition>
      </div>
      
      <!-- Dropdown menu -->
      <transition
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 max-h-0"
        leave-to-class="opacity-0 max-h-0"
      >
        <ul v-if="isSidebarOpen && isDropdownOpen" class="pl-10 mt-1 space-y-1 overflow-hidden">
          <li v-for="child in item.children" :key="child.name">
            <router-link 
              :to="child.route"
              class="block px-4 py-2 text-sm rounded-md cursor-pointer transition-colors duration-200"
              :class="route.path === child.route 
                ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            >
              {{ child.name }}
            </router-link>
          </li>
        </ul>
      </transition>
    </div>
    
    <!-- Regular menu item without children -->
    <router-link
      v-else
      :to="item.route"
      @click="handleClick"
      class="flex items-center px-4 py-3 rounded-lg transition-colors duration-200"
      :class="[
        isActive
          ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        !isSidebarOpen && 'justify-center'
      ]"
    >
      <svg 
        class="w-6 h-6"
        :class="{ 'mr-3': isSidebarOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
      </svg>
      <transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <span v-if="isSidebarOpen" class="font-medium">{{ item.name }}</span>
      </transition>
    </router-link>
  </li>
</template>