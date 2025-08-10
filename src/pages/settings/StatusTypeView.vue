<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-2">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">Status Types</h1>
      <button 
        @click="openModal('create')" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Status Type
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input
            id="search"
            v-model="filters.search"
            type="text"
            placeholder="Search by name or code..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="w-full md:w-48">
          <label for="is_active" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            id="is_active"
            v-model="filters.is_active"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
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

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <!-- No results -->
    <div v-else-if="statusTypes.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">No status types found</p>
    </div>

    <!-- Results table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="statusType in statusTypes" :key="statusType.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">#{{ statusType.id }}</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-[200px] break-words">{{ statusType.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ statusType.code }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs">{{ statusType.description }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span 
                :class="statusType.is_active 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'" 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ statusType.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ statusType.ordering_id || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="openModal('edit', statusType)" 
                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
              >
                Edit
              </button>
              <button 
                @click="confirmDelete(statusType)" 
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <Pagination 
        v-if="!loading && statusTypes.length > 0" 
        :meta="pagination" 
        @page-change="changePage" 
        @per-page-change="changePerPage"
      />
    </div>

    <!-- Status Type Form Modal -->
    <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="showModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">{{ modalMode === 'create' ? 'Add New Status Type' : 'Edit Status Type' }}</h3>
            <form @submit.prevent="submitForm">
              <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div class="mb-4">
                <label for="code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                <input
                  id="code"
                  v-model="formData.code"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div class="mb-4">
                <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  rows="3"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              <div class="mb-4">
                <label for="ordering_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
                <input
                  id="ordering_id"
                  v-model.number="formData.ordering_id"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div class="mb-4">
                <div class="flex items-center">
                  <input
                    id="is_active"
                    v-model="formData.is_active"
                    type="checkbox"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label for="is_active" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">Active</label>
                </div>
              </div>
            </form>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="submitForm" 
              :disabled="formSubmitting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ formSubmitting ? 'Saving...' : 'Save' }}
            </button>
            <button 
              @click="showModal = false" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDeleteModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">Delete Status Type</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this status type? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="deleteStatusType" 
              :disabled="deleteSubmitting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ deleteSubmitting ? 'Deleting...' : 'Delete' }}
            </button>
            <button 
              @click="showDeleteModal = false" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { getAuthHeaders } from '../../services/auth'
import Pagination from '../../components/common/Pagination.vue'

// State
const statusTypes = ref([])
const loading = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('create')
const formSubmitting = ref(false)
const deleteSubmitting = ref(false)
const selectedStatusType = ref(null)
const error = ref(null)

// Pagination state
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
  is_active: '',
  page: 1,
  per_page: 20
})

// Form data
const formData = ref({
  name: '',
  code: '',
  description: '',
  is_active: true,
  ordering_id: null
})

// Fetch status types with pagination and filters
const fetchStatusTypes = async () => {
  try {
    loading.value = true
    const headers = await getAuthHeaders()
    
    // Build query params
    const params = new URLSearchParams()
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.is_active !== '') params.append('is_active', filters.value.is_active)
    params.append('page', filters.value.page)
    params.append('per_page', filters.value.per_page)
    
    const response = await axios.get(`${API_URL}/status-types/get?${params.toString()}`, { headers })
    
    if (response.data.status) {
      statusTypes.value = response.data.data
      
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
    }
  } catch (error) {
    console.error('Error fetching status types:', error)
  } finally {
    loading.value = false
  }
}

// Change page
const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  filters.value.page = page
  fetchStatusTypes()
}

// Change items per page
const changePerPage = (perPage) => {
  filters.value.per_page = perPage
  filters.value.page = 1 // Reset to first page when changing items per page
  fetchStatusTypes()
}

// Apply filters
const applyFilters = () => {
  filters.value.page = 1 // Reset to first page when applying filters
  fetchStatusTypes()
}

// Reset filters
const resetFilters = () => {
  filters.value = {
    search: '',
    is_active: '',
    page: 1,
    per_page: 20
  }
  fetchStatusTypes()
}

// Open modal for create or edit
const openModal = (mode, statusType = null) => {
  modalMode.value = mode
  error.value = null
  
  if (mode === 'edit' && statusType) {
    selectedStatusType.value = statusType
    formData.value = {
      name: statusType.name,
      code: statusType.code,
      description: statusType.description,
      is_active: statusType.is_active,
      ordering_id: statusType.ordering_id
    }
  } else {
    // Reset form for create mode
    formData.value = {
      name: '',
      code: '',
      description: '',
      is_active: true,
      ordering_id: null
    }
  }
  
  showModal.value = true
}

// Submit form (create or update)
const submitForm = async () => {
  try {
    formSubmitting.value = true
    const headers = await getAuthHeaders()
    
    let response
    
    if (modalMode.value === 'create') {
      response = await axios.post(`${API_URL}/status-types/status-type/create`, formData.value, { headers })
    } else {
      response = await axios.put(`${API_URL}/status-types/status-type/${selectedStatusType.value.id}/update`, formData.value, { headers })
    }
    
    if (response.data.status) {
      showModal.value = false
      fetchStatusTypes() // Refresh the list
    } else {
      error.value = response.data.message || 'An error occurred'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    console.error('Error submitting form:', err)
  } finally {
    formSubmitting.value = false
  }
}

// Confirm delete
const confirmDelete = (statusType) => {
  selectedStatusType.value = statusType
  showDeleteModal.value = true
}

// Delete status type
const deleteStatusType = async () => {
  try {
    deleteSubmitting.value = true
    const headers = await getAuthHeaders()
    
    const response = await axios.delete(`${API_URL}/status-types/status-type/${selectedStatusType.value.id}/delete`, { headers })
    
    if (response.data.status) {
      showDeleteModal.value = false
      fetchStatusTypes() // Refresh the list
    } else {
      console.error('Error deleting status type:', response.data.message)
    }
  } catch (err) {
    console.error('Error deleting status type:', err)
  } finally {
    deleteSubmitting.value = false
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchStatusTypes()
})
</script>
