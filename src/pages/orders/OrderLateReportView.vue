<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Kechikkan buyurtmalar</h1>
    
    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qidirish</label>
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="General search"
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            @keyup.enter="fetchReports"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dokon</label>
          <input 
            type="text" 
            v-model="filters.store" 
            placeholder="Filter by store"
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            @keyup.enter="fetchReports"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mahsulot</label>
          <input 
            type="text" 
            v-model="filters.product" 
            placeholder="Filter by product"
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            @keyup.enter="fetchReports"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
          <input 
            type="text" 
            v-model="filters.sku" 
            placeholder="Filter by SKU"
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            @keyup.enter="fetchReports"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Waiting Days</label>
          <input 
            type="number" 
            v-model="filters.min_waiting_days" 
            placeholder="Minimum days"
            min="0"
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            @keyup.enter="fetchReports"
          />
        </div>
        <div class="flex items-end md:col-span-2">
          <button 
            @click="fetchReports" 
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm mr-2"
          >
            Apply Filters
          </button>
          <button 
            @click="resetFilters" 
            class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md text-sm"
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
    
    <!-- Results table -->
    <div v-else-if="reports.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th @click="toggleSort('store')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center">
                  <span>Dokon</span>
                  <span v-if="sortField === 'store'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('product')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center">
                  <span>Mahsulot</span>
                  <span v-if="sortField === 'product'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('sku')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center">
                  <span>SKU</span>
                  <span v-if="sortField === 'sku'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('new_quantity')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center">
                  <span>Yangi</span>
                  <span v-if="sortField === 'new_quantity'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('waiting_quantity')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center">
                  <span>Kutilmoqda</span>
                  <span v-if="sortField === 'waiting_quantity'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('min_days_new')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center">
                  <span>Min Kun (Yangi)</span>
                  <span v-if="sortField === 'min_days_new'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('max_days_new')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center">
                  <span>Max Kun (Yangi)</span>
                  <span v-if="sortField === 'max_days_new'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('min_days_waiting')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center">
                  <span>Min Kun (Kutilmoqda)</span>
                  <span v-if="sortField === 'min_days_waiting'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('max_days_waiting')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center">
                  <span>Max Kun (Kutilmoqda)</span>
                  <span v-if="sortField === 'max_days_waiting'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Buyurtma raqamlari</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(report, index) in sortedReports" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ report.store }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-[300px] break-words">{{ report.product }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ report.sku }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ report.new_quantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ report.waiting_quantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="getWaitingDaysClass(report.min_days_new || 0)">
                {{ report.min_days_new !== null ? report.min_days_new + ' kun' : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="getWaitingDaysClass(report.max_days_new || 0)">
                {{ report.max_days_new !== null ? report.max_days_new + ' kun' : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="getWaitingDaysClass(report.min_days_waiting || 0)">
                {{ report.min_days_waiting !== null ? report.min_days_waiting + ' kun' : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="getWaitingDaysClass(report.max_days_waiting || 0)">
                {{ report.max_days_waiting !== null ? report.max_days_waiting + ' kun' : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center">
                  <span>{{ formatOrderNumbers(report.order_ids) }}</span>
                  <button 
                    @click="copyToClipboard(report.order_ids)" 
                    class="ml-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    title="Copy all order numbers"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <Pagination 
        v-if="pagination.total > 0" 
        :meta="pagination" 
        @page-change="changePage" 
        @per-page-change="changePerPage"
        class="mt-4"
      />
    </div>
    
    <!-- No results -->
    <div v-else-if="!loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">Buyurtmalar topilmadi. Filtrlaringizni qayta tiklang.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { getAuthHeaders } from '../../services/auth'
import Pagination from '../../components/common/Pagination.vue'

// External API configuration
const EXTERNAL_URL = import.meta.env.VITE_EXTERNAL_URL
const EXTERNAL_API_KEY = import.meta.env.VITE_EXTERNAL_API_KEY

// State
const reports = ref([])
const stores = ref([])
const loading = ref(false)
const error = ref(null)
const copySuccess = ref(false)

// Sorting state
const sortField = ref('max_days_waiting')
const sortDirection = ref('desc')

// Filters
const filters = ref({
  search: '',
  store: '',
  product: '',
  sku: '',
  min_waiting_days: '',
  page: 1,
  per_page: 20
})

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

// Fetch order reports
const fetchReports = async () => {
  try {
    loading.value = true
    
    // Build query params
    const params = new URLSearchParams()
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.store) params.append('store', filters.value.store)
    if (filters.value.product) params.append('product', filters.value.product)
    if (filters.value.sku) params.append('sku', filters.value.sku)
    if (filters.value.min_waiting_days) params.append('min_waiting_days', filters.value.min_waiting_days)
    params.append('page', filters.value.page)
    params.append('per_page', filters.value.per_page)
    
    // Use external API endpoint with API key in header
    const endpoint = `${EXTERNAL_URL}/api/v1/late-orders`
    const headers = {
      'X-API-Key': EXTERNAL_API_KEY
    }
    
    const response = await axios.get(`${endpoint}?${params.toString()}`, { headers })
    
    
    if (response.data.status) {
      reports.value = response.data.data
      
      // Extract unique stores for filter dropdown
      const uniqueStores = [...new Set(reports.value.map(report => report.store))]
      if (uniqueStores.length > 0) {
        stores.value = uniqueStores
      }
      
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
    } else {
      error.value = response.data.message || 'Failed to fetch order reports'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    console.error('Error fetching order reports:', err)
  } finally {
    loading.value = false
  }
}

// Reset filters
const resetFilters = () => {
  filters.value = {
    search: '',
    store: '',
    product: '',
    sku: '',
    min_waiting_days: '',
    page: 1,
    per_page: 20
  }
  fetchReports()
}

// Change page
const changePage = (page) => {
  filters.value.page = page
  fetchReports()
}

// Change items per page
const changePerPage = (perPage) => {
  filters.value.per_page = perPage
  filters.value.page = 1
  fetchReports()
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Format order numbers (show max 3)
const formatOrderNumbers = (orderNumbersString) => {
  if (!orderNumbersString) return '-'
  const orderNumbers = orderNumbersString.split(' ')
  if (orderNumbers.length <= 3) {
    return orderNumbers.join(' ')
  }
  return `${orderNumbers.slice(0, 3).join(' ')}...`
}

// Copy order numbers to clipboard
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Get class for waiting days (color coding based on urgency)
const getWaitingDaysClass = (days) => {
  const daysNum = parseInt(days)
  if (daysNum >= 30) return 'text-red-600 dark:text-red-400 font-bold'
  if (daysNum >= 14) return 'text-orange-600 dark:text-orange-400'
  if (daysNum >= 7) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-green-600 dark:text-green-400'
}

// Fetch data on component mount
// Toggle sort field and direction
const toggleSort = (field) => {
  if (sortField.value === field) {
    // Toggle direction if clicking the same field
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new field and default to ascending
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

// Computed property for sorted reports
const sortedReports = computed(() => {
  if (!reports.value.length) return []
  
  return [...reports.value].sort((a, b) => {
    let aValue = a[sortField.value]
    let bValue = b[sortField.value]
    
    // Handle special cases for nested properties or null values
    if (sortField.value === 'min_days_new' || sortField.value === 'max_days_new' || 
        sortField.value === 'min_days_waiting' || sortField.value === 'max_days_waiting') {
      aValue = aValue === null ? -1 : aValue
      bValue = bValue === null ? -1 : bValue
    }
    
    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue)
      return sortDirection.value === 'asc' ? comparison : -comparison
    }
    
    // Handle number comparison
    if (sortDirection.value === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })
})

onMounted(() => {
  fetchReports()
})
</script>
