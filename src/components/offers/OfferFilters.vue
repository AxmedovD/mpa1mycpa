<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <!-- Search by name -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search by Name</label>
        <input
          id="name"
          v-model="localFilters.name"
          type="text"
          placeholder="Search offers..."
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <!-- Filter by user with SearchSelect -->
      <div>
        <label for="user_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User</label>
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearchInput"
            @focus="showDropdown = true"
            placeholder="Search users..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          
          <!-- Loading indicator -->
          <div v-if="loading" class="absolute right-3 top-2.5">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-gray-300"></div>
          </div>
          
          <!-- Dropdown -->
          <div
            v-show="showDropdown && userOptions.length > 0"
            class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 max-h-60 overflow-auto"
          >
            <ul class="py-1">
              <li
                v-for="user in userOptions"
                :key="user.id"
                @click="selectUser(user)"
                class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-900 dark:text-white"
              >
                {{ user.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Filter by status (offer statuses with type_id=2) -->
      <div>
        <label for="status_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offer Status</label>
        <select
          id="status_id"
          v-model="localFilters.status_id"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Statuses</option>
          <option v-for="status in statuses" :key="status.id" :value="status.id">{{ status.name }}</option>
        </select>
      </div>

      <!-- Filter by type (statuses with type_id=3) -->
      <div>
        <label for="type_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offer Type</label>
        <select
          id="type_id"
          v-model="localFilters.type_id"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Types</option>
          <option v-for="type in types" :key="type.id" :value="type.id">{{ type.name }}</option>
        </select>
      </div>

      <!-- Filter by landing page existence -->
      <div>
        <label for="is_exist_landing" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Landing Page</label>
        <select
          id="is_exist_landing"
          v-model="localFilters.is_exist_landing"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All</option>
          <option value="true">Has Landing Page</option>
          <option value="false">No Landing Page</option>
        </select>
      </div>

      <!-- Filter by creative existence -->
      <div>
        <label for="is_exist_creative" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Creative</label>
        <select
          id="is_exist_creative"
          v-model="localFilters.is_exist_creative"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All</option>
          <option value="true">Has Creative</option>
          <option value="false">No Creative</option>
        </select>
      </div>

      <!-- Action buttons -->
      <div class="flex items-end">
        <button 
          @click="applyFilters" 
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md mr-2"
        >
          Filter
        </button>
        <button 
          @click="resetFilters" 
          class="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-md"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { debounce } from 'lodash-es'
import { API_URL } from '../../config/api'
import { getAuthHeaders } from '../../services/auth'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  users: {
    type: Array,
    default: () => []
  },
  statuses: {
    type: Array,
    default: () => []
  },
  types: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:filters', 'filter', 'reset'])

// Create a local copy of filters to avoid direct mutation
const localFilters = ref({...props.filters})

// User search dropdown state
const searchQuery = ref('')
const userOptions = ref([])
const loading = ref(false)
const showDropdown = ref(false)

// Fetch users based on search query
const fetchUsers = async (query = '') => {
  try {
    loading.value = true
    const headers = await getAuthHeaders()
    const params = { 
      type: 'store', 
      per_page: 100 
    }
    
    if (query) {
      params.username = query
    }
    
    const response = await axios.get(`${API_URL}/users/get`, { headers, params })
    
    if (response.data.status) {
      userOptions.value = response.data.data.map(user => ({
        id: user.id,
        name: user.username
      }))
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    userOptions.value = []
  } finally {
    loading.value = false
  }
}

// Debounced search function
const debouncedSearch = debounce(async (query) => {
  await fetchUsers(query)
}, 300)

// Handle search input
const handleSearchInput = (e) => {
  const query = e.target.value
  showDropdown.value = true
  debouncedSearch(query)
}

// Select a user from dropdown
const selectUser = (user) => {
  searchQuery.value = user.name
  localFilters.value.user_id = user.id
  showDropdown.value = false
}

// Close dropdown when clicking outside
const closeDropdown = (event) => {
  if (!event.target.closest('.relative')) {
    showDropdown.value = false
  }
}

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = {...newFilters}
  
  // Reset search query if user_id is cleared
  if (!newFilters.user_id) {
    searchQuery.value = ''
  }
}, { deep: true })

// Initialize user dropdown with data
onMounted(() => {
  // Load initial user options
  fetchUsers()
  
  // Set initial search query if user_id is already set
  if (localFilters.value.user_id) {
    const user = props.users.find(u => u.id === localFilters.value.user_id)
    if (user) {
      searchQuery.value = user.username
    }
  }
  
  // Add event listener for closing dropdown
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

// Apply filters
const applyFilters = () => {
  emit('update:filters', {...localFilters.value})
  emit('filter')
}

// Reset filters
const resetFilters = () => {
  const resetValues = {
    name: '',
    user_id: '',
    status_id: '',
    type_id: '',
    is_exist_landing: '',
    is_exist_creative: '',
    page: 1,
    per_page: props.filters.per_page || 20
  }
  
  localFilters.value = {...resetValues}
  emit('update:filters', {...resetValues})
  emit('reset')
}
</script>
