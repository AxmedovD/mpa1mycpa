<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manager and Source Report</h1>
    
    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manager</label>
          <input 
            type="text" 
            v-model="filters.manager" 
            placeholder="Filter by manager"
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            @keyup.enter="fetchReport"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
          <input 
            type="text" 
            v-model="filters.source" 
            placeholder="Filter by source"
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            @keyup.enter="fetchReport"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
          <input 
            type="date" 
            v-model="filters.start_date" 
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
          <input 
            type="date" 
            v-model="filters.end_date" 
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="flex items-end md:col-span-4">
          <button 
            @click="fetchReport" 
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
              <th @click="toggleSort('manager')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center">
                  <span>Manager</span>
                  <span v-if="sortField === 'manager'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('source')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center">
                  <span>Source</span>
                  <span v-if="sortField === 'source'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('total_leads')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center">
                  <span>Total Leads</span>
                  <span v-if="sortField === 'total_leads'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('approved.count')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" colspan="2">
                <div class="flex items-center justify-center">
                  <span>Approved</span>
                  <span v-if="sortField === 'approved.count'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('sold.count')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" colspan="2">
                <div class="flex items-center justify-center">
                  <span>Sold</span>
                  <span v-if="sortField === 'sold.count'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('returned.count')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" colspan="2">
                <div class="flex items-center justify-center">
                  <span>Returned</span>
                  <span v-if="sortField === 'returned.count'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('canceled.count')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" colspan="2">
                <div class="flex items-center justify-center">
                  <span>Canceled</span>
                  <span v-if="sortField === 'canceled.count'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
            </tr>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Count</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">%</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Count</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">%</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Count</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">%</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Count</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">%</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(report, index) in sortedReports" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ report.manager }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ report.source }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ report.total_leads }}</td>
              
              <!-- Approved -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                {{ report.approved.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(report.approved.percentage)">
                {{ report.approved.percentage }}%
              </td>
              
              <!-- Sold -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                {{ report.sold.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(report.sold.percentage)">
                {{ report.sold.percentage }}%
              </td>
              
              <!-- Returned -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                {{ report.returned.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(report.returned.percentage, true)">
                {{ report.returned.percentage }}%
              </td>
              
              <!-- Canceled -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                {{ report.canceled.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(report.canceled.percentage, true)">
                {{ report.canceled.percentage }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- No results -->
    <div v-else-if="!loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">No reports found. Try adjusting your filters.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { getAuthHeaders } from '../../services/auth'

// State
const reports = ref([])
const loading = ref(false)
const error = ref(null)

// Sorting state
const sortField = ref('total_leads')
const sortDirection = ref('desc')

// Filters
const filters = ref({
  manager: '',
  source: '',
  start_date: '',
  end_date: '',
  page: 1,
  per_page: 100
})

// Fetch report data
const fetchReport = async () => {
  try {
    loading.value = true
    const headers = await getAuthHeaders()
    
    // Build query params
    const params = new URLSearchParams()
    if (filters.value.manager) params.append('manager', filters.value.manager)
    if (filters.value.source) params.append('source', filters.value.source)
    if (filters.value.start_date) params.append('start_date', filters.value.start_date)
    if (filters.value.end_date) params.append('end_date', filters.value.end_date)
    
    const response = await axios.get(`${API_URL}/reports/orders/manager-source?${params.toString()}`, { headers })
    
    if (response.data.status) {
      reports.value = response.data.data
    } else {
      error.value = response.data.message || 'Failed to fetch report'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    console.error('Error fetching report:', err)
  } finally {
    loading.value = false
  }
}

// Reset filters
const resetFilters = () => {
  filters.value = {
    manager: '',
    source: '',
    start_date: '',
    end_date: '',
    page: 1,
    per_page: 100
  }
  fetchReport()
}

// Toggle sort field and direction
const toggleSort = (field) => {
  if (sortField.value === field) {
    // Toggle direction if clicking the same field
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new field and default to descending for counts
    sortField.value = field
    sortDirection.value = field.includes('count') ? 'desc' : 'asc'
  }
}

// Get color class based on percentage value
const getPercentageClass = (percentage, isNegative = false) => {
  if (isNegative) {
    // For metrics where lower is better (returned, canceled)
    if (percentage >= 30) return 'text-red-600 dark:text-red-400 font-bold'
    if (percentage >= 20) return 'text-orange-600 dark:text-orange-400'
    if (percentage >= 10) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  } else {
    // For metrics where higher is better (approved, sold)
    if (percentage >= 80) return 'text-green-600 dark:text-green-400 font-bold'
    if (percentage >= 60) return 'text-green-600 dark:text-green-400'
    if (percentage >= 40) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }
}

// Computed property for sorted reports
const sortedReports = computed(() => {
  if (!reports.value.length) return []
  
  return [...reports.value].sort((a, b) => {
    let aValue, bValue
    
    // Handle nested properties (e.g., 'approved.count')
    if (sortField.value.includes('.')) {
      const [parent, child] = sortField.value.split('.')
      aValue = a[parent][child]
      bValue = b[parent][child]
    } else {
      aValue = a[sortField.value]
      bValue = b[sortField.value]
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

// Fetch data on component mount
onMounted(() => {
  fetchReport()
})
</script>
