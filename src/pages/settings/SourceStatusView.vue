<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-2">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">Source Statuses</h1>
      <div class="flex space-x-3">
        <button 
          @click="syncSourceStatuses" 
          :disabled="syncLoading"
          class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!syncLoading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <div v-else class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
          {{ syncLoading ? 'Syncing...' : 'Sync Statuses' }}
        </button>
        <button 
          @click="openModal('create')" 
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Source Status
        </button>
      </div>
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
            @keyup.enter="applyFilters"
            placeholder="Search by name or code..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="w-full md:w-48">
          <label for="source_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source Integration</label>
          <select
            id="source_id"
            v-model="filters.source_id"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Sources</option>
            <option v-for="source in sourceIntegrations" :key="source.id" :value="source.id">{{ source.name }}</option>
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
    <div v-else-if="sourceStatuses.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">No source statuses found</p>
    </div>

    <!-- Results table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600" style="min-width: 1000px;">
        <table class="w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed" style="min-width: 1000px;">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" style="width: 50px;">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="sourceStatuses.length > 0 && selectedSourceStatusIds.length === sourceStatuses.length"
                  @change="toggleSelectAll"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" style="width: 80px;">ID</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" style="width: 200px;">Name</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" style="width: 120px;">Code</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" style="width: 150px;">Extra ID</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" style="width: 250px;">Source Integration</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" style="width: 120px;">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="sourceStatus in sourceStatuses" :key="sourceStatus.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  v-model="selectedSourceStatusIds"
                  :value="sourceStatus.id"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">#{{ sourceStatus.id }}</td>
            <td class="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
              <div class="truncate" :title="sourceStatus.name">{{ sourceStatus.name }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ sourceStatus.code }}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ sourceStatus.extra_id || '-' }}</td>
            <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
              <div class="truncate" :title="sourceStatus.source_integration?.name">{{ sourceStatus.source_integration?.name || '-' }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex justify-center space-x-2">
                <button 
                  @click="openModal('edit', sourceStatus)" 
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                >
                  Edit
                </button>
                <span class="text-gray-300">|</span>
                <button 
                  @click="confirmDelete(sourceStatus)" 
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- Pagination -->
      <Pagination 
        v-if="!loading && sourceStatuses.length > 0" 
        :meta="pagination" 
        @page-change="changePage" 
        @per-page-change="changePerPage"
        class="mt-4"
      />
      
      <!-- Fixed Action Bar -->
      <FixedActions
        :selected-count="selectedSourceStatusIds.length"
        :visible="selectedSourceStatusIds.length > 0"
        @change-status="openBulkStatusModal"
        @cancel="clearSelection"
      >
        <template #info>
          {{ selectedSourceStatusIds.length }} {{ selectedSourceStatusIds.length === 1 ? 'source status' : 'source statuses' }} selected
        </template>
        <template #actions>
          <button 
            @click="openBulkDeleteModal"
            class="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded-md text-sm mr-2"
          >
            Delete
          </button>
          <button 
            @click="openBulkUpdateModal"
            class="bg-amber-600 hover:bg-amber-700 text-white font-medium py-1.5 px-3 rounded-md text-sm mr-2"
          >
            Bulk Update
          </button>
        </template>
      </FixedActions>

    </div>

    <!-- Source Status Form Modal -->
    <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="showModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">{{ modalMode === 'create' ? 'Add New Source Status' : 'Edit Source Status' }}</h3>
            <form @submit.prevent="submitForm">
              <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  required
                  maxlength="255"
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
                  maxlength="50"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div class="mb-4">
                <label for="extra_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Extra ID</label>
                <input
                  id="extra_id"
                  v-model="formData.extra_id"
                  type="text"
                  maxlength="255"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div class="mb-4">
                <label for="source_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source Integration</label>
                <select
                  id="source_id"
                  v-model="formData.source_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="" disabled>Select a source integration</option>
                  <option v-for="source in sourceIntegrations" :key="source.id" :value="source.id">{{ source.name }}</option>
                </select>
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
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">Delete Source Status</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this source status? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="deleteSourceStatus" 
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

    <!-- Bulk Update Modal -->
    <div v-if="showBulkUpdateModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="showBulkUpdateModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">Bulk Update Source Statuses</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Update {{ selectedSourceStatusIds.length }} selected source status{{ selectedSourceStatusIds.length === 1 ? '' : 'es' }}
            </p>
            <form @submit.prevent="submitBulkUpdate">
              <div class="mb-4">
                <label class="flex items-center mb-2">
                  <input
                    type="checkbox"
                    v-model="bulkUpdateData.updateSourceId"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
                  />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Update Source Integration</span>
                </label>
                <select
                  v-if="bulkUpdateData.updateSourceId"
                  v-model="bulkUpdateData.source_id"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="" disabled>Select a source integration</option>
                  <option v-for="source in sourceIntegrations" :key="source.id" :value="source.id">{{ source.name }}</option>
                </select>
              </div>
            </form>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="submitBulkUpdate" 
              :disabled="bulkUpdateSubmitting || !bulkUpdateData.updateSourceId"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ bulkUpdateSubmitting ? 'Updating...' : 'Update' }}
            </button>
            <button 
              @click="showBulkUpdateModal = false" 
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
import FixedActions from '../../components/common/FixedActions.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

// State
const sourceStatuses = ref([])
const sourceIntegrations = ref([])
const loading = ref(false)
const syncLoading = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const showBulkUpdateModal = ref(false)
const modalMode = ref('create')
const formSubmitting = ref(false)
const deleteSubmitting = ref(false)
const bulkUpdateSubmitting = ref(false)
const selectedSourceStatusIds = ref([])
const selectedSourceStatus = ref(null)
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
  source_id: '',
  page: 1,
  per_page: 20
})

// Form data
const formData = ref({
  name: '',
  code: '',
  extra_id: '',
  source_id: ''
})

// Bulk update data
const bulkUpdateData = ref({
  updateSourceId: false,
  source_id: ''
})

// Fetch source statuses with pagination and filters
const fetchSourceStatuses = async () => {
  try {
    loading.value = true
    const headers = await getAuthHeaders()
    
    // Build query params
    const params = new URLSearchParams()
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.source_id) params.append('source_id', filters.value.source_id)
    params.append('page', filters.value.page)
    params.append('per_page', filters.value.per_page)
    
    const response = await axios.get(`${API_URL}/source-statuses/get?${params.toString()}`, { headers })
    
    if (response.data.success) {
      sourceStatuses.value = response.data.data
      
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
    console.error('Error fetching source statuses:', error)
  } finally {
    loading.value = false
  }
}

// Fetch source integrations for dropdown
const fetchSourceIntegrations = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.get(`${API_URL}/source-integrations/get`, { 
      headers,
      params: { per_page: 100 }
    })
    
    if (response.data.success) {
      sourceIntegrations.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching source integrations:', error)
  }
}

// Change page
const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  filters.value.page = page
  fetchSourceStatuses()
}

// Change items per page
const changePerPage = (perPage) => {
  filters.value.per_page = perPage
  filters.value.page = 1 // Reset to first page when changing items per page
  fetchSourceStatuses()
}

// Apply filters
const applyFilters = () => {
  filters.value.page = 1 // Reset to first page when applying filters
  fetchSourceStatuses()
}

// Reset filters
const resetFilters = () => {
  filters.value = {
    search: '',
    source_id: '',
    page: 1,
    per_page: 20
  }
  fetchSourceStatuses()
}

// Open modal for create or edit
const openModal = (mode, sourceStatus = null) => {
  modalMode.value = mode
  error.value = null
  
  if (mode === 'edit' && sourceStatus) {
    selectedSourceStatus.value = sourceStatus
    formData.value = {
      name: sourceStatus.name,
      code: sourceStatus.code,
      extra_id: sourceStatus.extra_id || '',
      source_id: sourceStatus.source_id
    }
  } else {
    // Reset form for create mode
    formData.value = {
      name: '',
      code: '',
      extra_id: '',
      source_id: ''
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
      response = await axios.post(`${API_URL}/source-statuses/source-status/create`, formData.value, { headers })
    } else {
      response = await axios.put(`${API_URL}/source-statuses/source-status/${selectedSourceStatus.value.id}/update`, formData.value, { headers })
    }
    
    if (response.data.success) {
      showModal.value = false
      fetchSourceStatuses() // Refresh the list
      
      // Show success toast
      if (modalMode.value === 'create') {
        toast.success(`Source status "${formData.value.name}" created successfully!`)
      } else {
        toast.success(`Source status "${formData.value.name}" updated successfully!`)
      }
    } else {
      error.value = response.data.message || 'An error occurred'
      toast.error(`❌ ${error.value}`)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    toast.error(`❌ ${error.value}`)
    console.error('Error submitting form:', err)
  } finally {
    formSubmitting.value = false
  }
}

// Confirm delete
const confirmDelete = (sourceStatus) => {
  selectedSourceStatus.value = sourceStatus
  showDeleteModal.value = true
}

// Delete source status
const deleteSourceStatus = async () => {
  try {
    deleteSubmitting.value = true
    const headers = await getAuthHeaders()
    const statusName = selectedSourceStatus.value.name
    
    const response = await axios.delete(`${API_URL}/source-statuses/source-status/${selectedSourceStatus.value.id}/delete`, { headers })
    
    if (response.data.success) {
      showDeleteModal.value = false
      fetchSourceStatuses() // Refresh the list
      toast.success(`🗑️ Source status "${statusName}" deleted successfully!`)
    } else {
      const errorMsg = response.data.message || 'Failed to delete source status'
      toast.error(`❌ ${errorMsg}`)
      console.error('Error deleting source status:', errorMsg)
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'An error occurred while deleting'
    toast.error(`❌ ${errorMsg}`)
    console.error('Error deleting source status:', err)
  } finally {
    deleteSubmitting.value = false
  }
}

// Toggle select all source statuses
const toggleSelectAll = () => {
  if (selectedSourceStatusIds.value.length === sourceStatuses.value.length) {
    selectedSourceStatusIds.value = []
  } else {
    selectedSourceStatusIds.value = sourceStatuses.value.map(sourceStatus => sourceStatus.id)
  }
}

// Open bulk update modal
const openBulkUpdateModal = () => {
  // Reset bulk update data
  bulkUpdateData.value = {
    updateSourceId: false,
    source_id: ''
  }
  showBulkUpdateModal.value = true
}

// Submit bulk update
const submitBulkUpdate = async () => {
  try {
    bulkUpdateSubmitting.value = true
    const headers = await getAuthHeaders()
    
    // Build the payload according to the validation rules
    const payload = {
      source_statuses: selectedSourceStatusIds.value.map(id => {
        const updateItem = { id }
        
        if (bulkUpdateData.value.updateSourceId) {
          updateItem.source_id = bulkUpdateData.value.source_id
        }
        
        return updateItem
      })
    }
    
    const response = await axios.post(`${API_URL}/source-statuses/bulk/update`, payload, { headers })
    
    if (response.data.success) {
      showBulkUpdateModal.value = false
      clearSelection()
      fetchSourceStatuses() // Refresh the list
    } else {
      console.error('Error in bulk update:', response.data.message)
    }
  } catch (err) {
    console.error('Error in bulk update:', err)
  } finally {
    bulkUpdateSubmitting.value = false
  }
}

// Open bulk delete modal
const openBulkDeleteModal = () => {
  // Implement bulk delete functionality
  console.log('Bulk delete for IDs:', selectedSourceStatusIds.value)
  // You can implement a confirmation modal for bulk deletion here
}

// Clear selected source statuses
const clearSelection = () => {
  selectedSourceStatusIds.value = []
}

// Fetch data on component mount
// Sync source statuses from external sources
const syncSourceStatuses = async () => {
  try {
    syncLoading.value = true
    const headers = await getAuthHeaders()
    
    // Using POST method as required by the API
    const response = await axios.post(`${API_URL}/source-statuses/sync`, {}, { headers })
    
    if (response.data.status || response.data.success) {
      const result = response.data.data
      
      // Show detailed success message with counts
      toast.success(
        `Statuses synced successfully! \n` +
        `✅ Inserted: ${result.inserted} \n` +
        `🔄 Updated: ${result.updated} \n` +
        `⏭️ Skipped: ${result.skipped}`
      )
      
      // Refresh the source statuses list
      fetchSourceStatuses()
    } else {
      toast.error(response.data.message || 'Failed to sync statuses')
    }
  } catch (error) {
    console.error('Error syncing source statuses:', error)
    toast.error(`Failed to sync statuses: ${error.response?.data?.message || error.message || 'Unknown error'}`)
  } finally {
    syncLoading.value = false
  }
}

onMounted(() => {
  fetchSourceIntegrations()
  fetchSourceStatuses()
})
</script>
