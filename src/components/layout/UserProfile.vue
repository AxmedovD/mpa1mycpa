<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import auth from '../../stores/auth'

const router = useRouter()
const user = computed(() => auth.user)

const isOpen = ref(false)
const trigger = ref(null)

const userInitials = computed(() => {
  if (!user.value?.name) return ''
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
})

const userName = computed(() => user.value?.name || '')
const userRole = computed(() => {
  return user.value?.type || 'User'
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleLogout = async () => {
  auth.logout()
  router.push('/login')
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (trigger.value && !trigger.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-3 focus:outline-none"
      ref="trigger"
    >
      <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
        <span class="text-gray-600 font-medium text-sm">
          {{ userInitials }}
        </span>
      </div>
      <div class="text-left hidden sm:block">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ userName }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ userRole }}
        </div>
      </div>
    </button>

    <!-- Dropdown menu -->
    <div
      v-show="isOpen"
      class="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50"
    >
      <a
        href="#"
        @click.prevent="handleLogout"
        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Logout
      </a>
    </div>
  </div>
</template>