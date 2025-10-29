<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-2">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">Offers</h1>
    </div>

    <!-- Filters -->
    <OfferFilters
      v-model:filters="filters"
      :users="users"
      :statuses="statuses"
      :types="types"
      @filter="fetchOffers"
      @reset="fetchOffers"
    />

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <!-- Results table -->
    <template v-else>
      <OfferTable
        :offers="offers"
        @edit="openEditModal"
        @change-status="openStatusModal"
        @update:selected="selectedOfferIds = $event"
      />
      
      <!-- Fixed Action Bar -->
      <FixedActions
        :selected-count="selectedOfferIds.length"
        :visible="selectedOfferIds.length > 0"
        @change-status="openBulkStatusModal(selectedOfferIds)"
        @cancel="clearSelection"
      />

      <!-- Pagination -->
      <Pagination 
        v-if="!loading && offers.length > 0" 
        :meta="pagination" 
        @page-change="changePage" 
        @per-page-change="changePerPage"
        class="mt-4"
      />
    </template>

    <!-- Edit Modal -->
    <OfferEditModal
      :show="showEditModal"
      :offer="selectedOffer"
      :users="users"
      @close="showEditModal = false"
      @update="updateOffer"
    />

    <!-- Status Change Modal -->
    <OfferStatusModal
      :show="showStatusModal"
      :offer="selectedOffer"
      :offer-ids="selectedOfferIds"
      :statuses="statuses"
      :types="types"
      @close="showStatusModal = false"
      @update="updateOfferStatus"
      @bulk-update="bulkUpdateOfferStatus"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { getAuthHeaders } from '../../services/auth'
import Pagination from '../../components/common/Pagination.vue'
import OfferFilters from '../../components/offers/OfferFilters.vue'
import OfferTable from '../../components/offers/OfferTable.vue'
import OfferEditModal from '../../components/offers/OfferEditModal.vue'
import OfferStatusModal from '../../components/offers/OfferStatusModal.vue'
import FixedActions from '../../components/common/FixedActions.vue'

// State
const offers = ref([])
const users = ref([])
const statuses = ref([])
const types = ref([])
const loading = ref(false)
const showEditModal = ref(false)
const showStatusModal = ref(false)
const selectedOffer = ref(null)
const selectedOfferIds = ref([])
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
  name: '',
  user_id: '',
  status_id: '',
  type_id: '',
  is_exist_landing: '',
  is_exist_creative: '',
  page: 1,
  per_page: 20
})

// Fetch offers with pagination and filters
const fetchOffers = async () => {
  try {
    loading.value = true
    const headers = await getAuthHeaders()
    
    // Build query params
    const params = new URLSearchParams()
    if (filters.value.name) params.append('name', filters.value.name)
    if (filters.value.user_id) params.append('user_id', filters.value.user_id)
    if (filters.value.status_id) params.append('status_id', filters.value.status_id)
    if (filters.value.type_id) params.append('type_id', filters.value.type_id)
    if (filters.value.is_exist_landing !== '') params.append('is_exist_landing', filters.value.is_exist_landing)
    if (filters.value.is_exist_creative !== '') params.append('is_exist_creative', filters.value.is_exist_creative)
    params.append('page', filters.value.page)
    params.append('per_page', filters.value.per_page)
    
    const response = await axios.get(`${API_URL}/offers/get?${params.toString()}`, { headers })
    
    if (response.data.status) {
      offers.value = response.data.data
      
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
    console.error('Error fetching offers:', error)
  } finally {
    loading.value = false
  }
}

// Fetch users for dropdown (only store type users who own offers)
const fetchUsers = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.get(`${API_URL}/users/get`, { 
      headers,
      params: { 
        per_page: 100,
        type: 'store' // Filter to only get store users who own offers
      }
    })
    
    if (response.data.status) {
      users.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

// Fetch statuses for dropdown (offer statuses with type_id=2)
const fetchStatuses = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.get(`${API_URL}/statuses/get`, { 
      headers,
      params: { per_page: 100, is_active: true, type_id: 2 }
    })
    
    if (response.data.status) {
      statuses.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching statuses:', error)
  }
}

// Fetch offer types (statuses with type_id=3)
const fetchStatusTypes = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.get(`${API_URL}/statuses/get`, { 
      headers,
      params: { per_page: 100, is_active: true, type_id: 3 }
    })
    
    if (response.data.status) {
      types.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching offer types:', error)
  }
}

// Change page
const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  filters.value.page = page
  fetchOffers()
}

// Change items per page
const changePerPage = (perPage) => {
  filters.value.per_page = perPage
  filters.value.page = 1 // Reset to first page when changing items per page
  fetchOffers()
}

// Open edit modal
const openEditModal = (offer) => {
  selectedOffer.value = offer
  showEditModal.value = true
}

// Open status change modal for a single offer
const openStatusModal = (offer) => {
  selectedOffer.value = offer
  selectedOfferIds.value = []
  showStatusModal.value = true
}

// Open status change modal for multiple offers
const openBulkStatusModal = (offerIds) => {
  selectedOffer.value = null
  selectedOfferIds.value = offerIds
  showStatusModal.value = true
}

// Clear selected offers
const clearSelection = () => {
  selectedOfferIds.value = []
}

// Update offer details
const updateOffer = async (data) => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.put(`${API_URL}/offers/offer/${data.id}/update`, data, { headers })
    
    if (response.data.status) {
      showEditModal.value = false
      fetchOffers() // Refresh the list
    } else {
      error.value = response.data.message || 'An error occurred'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    console.error('Error updating offer:', err)
  }
}

// Update offer status (single offer)
const updateOfferStatus = async (data) => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.put(`${API_URL}/offers/${data.id}/status`, {
      status_id: data.status_id,
      type_id: data.type_id
    }, { headers })
    
    if (response.data.status) {
      showStatusModal.value = false
      fetchOffers() // Refresh the list
    } else {
      error.value = response.data.message || 'An error occurred'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    console.error('Error updating offer status:', err)
  }
}

// Bulk update offer statuses
const bulkUpdateOfferStatus = async (data) => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.patch(`${API_URL}/offers/bulk-status`, data, { headers })
    
    if (response.data.status) {
      showStatusModal.value = false
      selectedOfferIds.value = [] // Clear selection after successful update
      fetchOffers() // Refresh the list
    } else {
      error.value = response.data.message || 'An error occurred'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    console.error('Error bulk updating offer statuses:', err)
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchUsers()
  fetchStatuses()
  fetchStatusTypes()
  fetchOffers()
})
</script>
