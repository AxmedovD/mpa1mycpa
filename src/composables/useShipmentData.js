import { ref } from 'vue'
import axios from 'axios'
import { API_URL } from '../services/api'
import { getAuthHeaders } from '../services/auth'

export function useShipmentData() {
  const shipments = ref([])
  const meta = ref({
    current_page: 1,
    per_page: 20,
    total: 0,
    filtered_total: 0,
    this_page: 0,
    last_page: 1
  })
  const loading = ref(false)
  const error = ref(null)
  const currentFilters = ref({})
  const sortBy = ref(null)
  const sortDirection = ref(null)

  const fetchShipments = async (page = 1, perPage = 20, filters = null) => {
    loading.value = true
    error.value = null
    currentFilters.value = filters || {}
    
    try {
      const headers = await getAuthHeaders()
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString()
      })

      // Only add sort parameters if they are explicitly set by user
      if (sortBy.value && sortDirection.value) {
        params.append('sortBy', sortBy.value)
        params.append('sortDirection', sortDirection.value)
      }

      // Only add filters if they are provided and have values
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '' && value !== false) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await axios.get(`${API_URL}/shipments/send/get`, {
        headers,
        params
      })
      
      console.log('API Response:', response.data)
      
      if (response.data.success) {
        shipments.value = response.data.data
        console.log('Shipments:', shipments.value)
        meta.value = {
          ...response.data.meta,
          filtered_total: response.data.meta.total,
          per_page: perPage
        }
        console.log('Meta:', meta.value)
      } else {
        throw new Error(response.data.message || 'Failed to fetch shipments')
      }
    } catch (err) {
      console.error('Error fetching shipments:', err)
      error.value = err.response?.data?.message || err.message || 'Failed to fetch shipments'
    } finally {
      loading.value = false
    }
  }

  const handlePageChange = (page) => {
    fetchShipments(page, meta.value.per_page, currentFilters.value)
  }

  const handlePerPageChange = (newPerPage) => {
    fetchShipments(1, newPerPage, currentFilters.value)
  }

  const applyFilters = (filters) => {
    fetchShipments(1, meta.value.per_page, filters)
  }

  const resetFilters = () => {
    currentFilters.value = {}
    sortBy.value = null
    sortDirection.value = null
    fetchShipments(1, meta.value.per_page)
  }

  return {
    shipments,
    meta,
    loading,
    error,
    fetchShipments,
    sortBy,
    sortDirection,
    setSort: (field, direction) => {
      sortBy.value = field
      sortDirection.value = direction
      fetchShipments(meta.value.current_page, meta.value.per_page, currentFilters.value)
    },
    handlePageChange,
    handlePerPageChange,
    applyFilters,
    resetFilters
  }
}
