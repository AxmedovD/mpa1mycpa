<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-2">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Users Management</h1>
      <button 
        @click="openCreateModal"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add User
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="Search by name or username"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="debouncedFetchUsers"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">User Type</label>
          <select 
            v-model="filters.type" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchUsers"
          >
            <option value="">All Types</option>
            <option v-for="type in userTypes" :key="type" :value="type">
              {{ formatUserType(type) }}
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            @click="resetFilters"
            class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-md"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      <div v-else-if="users.length === 0" class="py-20 text-center text-gray-500 dark:text-gray-400">
        No users found
      </div>
      <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">{{ user.username }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">{{ user.email || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getUserTypeClass(user.type)">
                {{ formatUserType(user.type) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="openEditModal(user)" 
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                Edit
              </button>
              <button 
                @click="confirmDelete(user)" 
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <Pagination 
        v-if="!loading && users.length > 0" 
        :meta="pagination" 
        @page-change="changePage" 
        @per-page-change="changePerPage"
      />
    </div>

    <!-- User Form Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ isEditing ? 'Edit User' : 'Create User' }}</h3>
        </div>
        <form @submit.prevent="submitForm">
          <div class="px-6 py-4 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input 
                  type="text" 
                  v-model="formData.name" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input 
                  type="text" 
                  v-model="formData.username" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  v-model="formData.email"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  v-model="formData.phone_number"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Type</label>
                <select 
                  v-model="formData.type" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="msadmin">Content Manager</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password {{ isEditing ? '(Leave blank to keep current)' : '' }}</label>
                <input 
                  type="password" 
                  v-model="formData.password"
                  :required="!isEditing"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
            <button 
              type="button" 
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="formSubmitting"
              class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ formSubmitting ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Confirm Delete</h3>
        </div>
        <div class="px-6 py-4 text-gray-900 dark:text-white">
          <p class="text-gray-700">Are you sure you want to delete the user <span class="font-medium">{{ userToDelete?.name }}</span>?</p>
          <p class="text-red-600 text-sm mt-2">This action cannot be undone.</p>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
          <button 
            type="button" 
            @click="closeDeleteModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button 
            type="button" 
            @click="deleteUser"
            :disabled="deleteSubmitting"
            class="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            {{ deleteSubmitting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { getAuthHeaders } from '../../services/auth'
import Pagination from '../../components/common/Pagination.vue'

// State
const users = ref([])
const userTypes = ref([])
const loading = ref(true)
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const formSubmitting = ref(false)
const deleteSubmitting = ref(false)
const userToDelete = ref(null)

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0,
  filtered_total: 0,
  this_page: 0,
  from: 0,
  to: 0
})

// State for filters
const filters = ref({
  search: '',
  type: '',
  page: 1,
  per_page: 20
})

const formData = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  phone_number: '',
  type: 'admin'
})

// Fetch users with pagination and filters
const fetchUsers = async () => {
  try {
    loading.value = true
    const headers = await getAuthHeaders()
    
    // Build query params
    const params = new URLSearchParams()
    if (filters.value.search) params.append('name', filters.value.search)
    if (filters.value.type) params.append('type', filters.value.type)
    params.append('page', filters.value.page)
    params.append('per_page', filters.value.per_page)
    
    const response = await axios.get(`${API_URL}/users/get?${params.toString()}`, { headers })
    
    if (response.data.status) {
      users.value = response.data.data
      
      // Update pagination
      pagination.value = {
        current_page: response.data.meta.current_page,
        last_page: response.data.meta.last_page,
        per_page: response.data.meta.per_page,
        total: response.data.meta.total,
        filtered_total: response.data.meta.filtered_total || response.data.meta.total,
        this_page: response.data.meta.this_page || response.data.meta.per_page,
        from: response.data.meta.from || ((response.data.meta.current_page - 1) * response.data.meta.per_page) + 1,
        to: response.data.meta.to || Math.min(response.data.meta.current_page * response.data.meta.per_page, response.data.meta.total)
      }
      
      // Get user types for filter
      if (response.data.types && response.data.types.length > 0) {
        userTypes.value = response.data.types
      }
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

// Debounced search
let searchTimeout
const debouncedFetchUsers = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.value.page = 1 // Reset to first page when searching
    fetchUsers()
  }, 300)
}

// Change page
const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  filters.value.page = page
  fetchUsers()
}

// Change items per page
const changePerPage = (perPage) => {
  filters.value.per_page = perPage
  filters.value.page = 1 // Reset to first page when changing items per page
  fetchUsers()
}

// Reset filters
const resetFilters = () => {
  filters.value = {
    search: '',
    type: '',
    page: 1,
    per_page: 15
  }
  fetchUsers()
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Format user type
const formatUserType = (type) => {
  if (!type) return '-'
  
  const types = {
    'superadmin': 'Super Admin',
    'admin': 'Admin',
    'msadmin': 'Content Manager',
    'target': 'Target',
    'storekeeper': 'Storekeeper'
  }
  
  return types[type] || type
}

// Get user type class for badge styling
const getUserTypeClass = (type) => {
  const baseClass = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full'
  
  const typeClasses = {
    'superadmin': `${baseClass} bg-purple-100 text-purple-800`,
    'admin': `${baseClass} bg-blue-100 text-blue-800`,
    'msadmin': `${baseClass} bg-green-100 text-green-800`,
    'target': `${baseClass} bg-yellow-100 text-yellow-800`,
    'storekeeper': `${baseClass} bg-gray-100 text-gray-800`
  }
  
  return typeClasses[type] || `${baseClass} bg-gray-100 text-gray-800`
}

// Modal functions
const openCreateModal = () => {
  isEditing.value = false
  formData.value = {
    name: '',
    username: '',
    email: '',
    password: '',
    phone_number: '',
    type: 'admin'
  }
  showModal.value = true
}

const openEditModal = (user) => {
  isEditing.value = true
  formData.value = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email || '',
    password: '',
    phone_number: user.phone || '',
    type: user.type
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// Submit form
const submitForm = async () => {
  try {
    formSubmitting.value = true
    const headers = await getAuthHeaders()
    
    let response
    
    if (isEditing.value) {
      // Update existing user
      response = await axios.put(`${API_URL}/users/{id}/update`, formData.value, { headers })
    } else {
      // Create new user
      response = await axios.post(`${API_URL}/users/create`, formData.value, { headers })
    }
    
    if (response.data.status) {
      closeModal()
      fetchUsers() // Refresh the list
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert(error.response?.data?.message || 'An error occurred')
  } finally {
    formSubmitting.value = false
  }
}

// Delete user
const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

const deleteUser = async () => {
  if (!userToDelete.value) return
  
  try {
    deleteSubmitting.value = true
    const headers = await getAuthHeaders()
    
    const response = await axios.delete(`${API_URL}/users/{id}/delete`, { headers })
    
    if (response.data.status) {
      closeDeleteModal()
      fetchUsers() // Refresh the list
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    alert(error.response?.data?.message || 'An error occurred')
  } finally {
    deleteSubmitting.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchUsers()
})
</script>
