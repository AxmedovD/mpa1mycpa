<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>
    
    <template v-else>
      <!-- Header section -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ offer.name }}
            <span class="text-gray-500 dark:text-gray-400 text-lg ml-2">#{{ offer.id }}</span>
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            User: {{ offer.user?.username || 'Unknown' }}
          </p>
        </div>
        
        <div class="mt-4 md:mt-0 flex flex-wrap items-center gap-3">
          <span 
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="getStatusClass(offer.status?.code)"
          >
            {{ offer.status?.name || 'Unknown Status' }}
          </span>
          
          <button 
            @click="showStatusModal = true" 
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Change Status
          </button>
          
          <button 
            @click="openEditModal()" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Edit
          </button>
          
          <button 
            @click="showDeleteModal = true" 
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button 
            @click="activeTab = 'details'" 
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === 'details' 
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
          >
            Details
          </button>
          <button 
            @click="activeTab = 'payments'" 
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === 'payments' 
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
          >
            Payments
          </button>
          <button 
            @click="activeTab = 'products'" 
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === 'products' 
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
          >
            Products
          </button>
        </nav>
      </div>
      
      <!-- Tab content -->
      <div>
        <!-- Details tab -->
        <div v-if="activeTab === 'details'">
          <OfferDetailsCard 
            :offer="offer" 
            @update-landing="updateLanding"
            @update-creative="updateCreative"
          />
        </div>
        
        <!-- Payments tab -->
        <div v-if="activeTab === 'payments'">
          <OfferPaymentsTable 
            :payments="offer.offer_pays || []" 
            @edit-payment="editPayment"
            @delete-payment="deletePayment"
            @add-payment="addPayment"
          />
        </div>
        
        <!-- Products tab -->
        <div v-if="activeTab === 'products'">
          <OfferProductsList :products="offer.offer_products || []" :offer-id="offerId" />
        </div>
      </div>
      
      <!-- Status change modal -->
      <div v-if="showStatusModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Status</h3>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select 
                v-model="selectedStatus" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option v-for="status in statuses" :key="status.id" :value="status.id">
                  {{ status.name }}
                </option>
              </select>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                @click="showStatusModal = false" 
                class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                @click="updateStatus" 
                :disabled="statusUpdating" 
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <svg v-if="statusUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delete confirmation modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Delete Offer</h3>
            
            <p class="text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete this offer? This action cannot be undone.
            </p>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                @click="showDeleteModal = false" 
                class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                @click="deleteOffer" 
                :disabled="deleting" 
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <svg v-if="deleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Edit Offer Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit Offer</h3>
            
            <form @submit.prevent="saveOfferChanges" class="space-y-4">
              <!-- Name -->
              <div>
                <label for="offer-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input 
                  type="text" 
                  id="offer-name" 
                  v-model="editForm.name" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <!-- Description -->
              <div>
                <label for="offer-desc" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  id="offer-desc" 
                  v-model="editForm.desc" 
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                ></textarea>
              </div>
              
              <!-- IDs section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Group ID -->
                <div>
                  <label for="group-id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group ID</label>
                  <input 
                    type="text" 
                    id="group-id" 
                    v-model="editForm.group_id" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <!-- Shipping Method ID -->
                <div>
                  <label for="shipping-method-id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shipping Method ID</label>
                  <input 
                    type="text" 
                    id="shipping-method-id" 
                    v-model="editForm.shipping_method_id" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <!-- Tariff ID -->
                <div>
                  <label for="tariff-id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tariff ID</label>
                  <input 
                    type="text" 
                    id="tariff-id" 
                    v-model="editForm.tariff_id" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <!-- Image URL -->
                <div>
                  <label for="image-url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                  <input 
                    type="text" 
                    id="image-url" 
                    v-model="editForm.image_url" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <!-- Toggle switches -->
              <div class="space-y-4">
                <!-- Landing Page Toggle -->
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Landing Page Exists</span>
                  <div class="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      id="edit-landing-toggle" 
                      v-model="editForm.is_exist_landing" 
                      class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label 
                      for="edit-landing-toggle" 
                      class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    ></label>
                  </div>
                </div>
                
                <!-- Creative Toggle -->
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Creative Exists</span>
                  <div class="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      id="edit-creative-toggle" 
                      v-model="editForm.is_exist_creative" 
                      class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label 
                      for="edit-creative-toggle" 
                      class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    ></label>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-end space-x-3 mt-6">
                <button 
                  type="button"
                  @click="showEditModal = false" 
                  class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  :disabled="saving"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Payment Edit Modal -->
      <PaymentEditModal 
        v-if="showPaymentModal" 
        :payment="selectedPayment" 
        :is-new="isNewPayment" 
        :offer-id="offerId"
        @save="savePayment" 
        @close="closePaymentModal" 
      />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { getAuthHeaders } from '../../services/auth'
import OfferDetailsCard from '../../components/offers/offersingle/OfferDetailsCard.vue'
import OfferPaymentsTable from '../../components/offers/offersingle/OfferPaymentsTable.vue'
import OfferProductsList from '../../components/offers/offersingle/OfferProductsList.vue'
import PaymentEditModal from '../../components/offers/offersingle/PaymentEditModal.vue'

const route = useRoute()
const router = useRouter()
const offerId = route.params.id

// State
const offer = ref({})
const loading = ref(true)
const error = ref(null)
const activeTab = ref('details')
const statuses = ref([])

// Modal state
const showStatusModal = ref(false)
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const editForm = ref({})
const saving = ref(false)

// Initialize edit form with offer data
const openEditModal = () => {
  editForm.value = {
    name: offer.value.name,
    desc: offer.value.desc || '',
    group_id: offer.value.group_id || '',
    shipping_method_id: offer.value.shipping_method_id || '',
    tariff_id: offer.value.tariff_id || '',
    image_url: offer.value.image_url || '',
    is_exist_landing: offer.value.is_exist_landing || false,
    is_exist_creative: offer.value.is_exist_creative || false
  }
  showEditModal.value = true
}

// Save offer changes
const saveOfferChanges = async () => {
  try {
    saving.value = true
    const headers = await getAuthHeaders()
    
    // Prepare the payload according to the API structure
    const payload = {
      name: editForm.value.name,
      desc: editForm.value.desc,
      img: editForm.value.image_url,
      is_exist_landing: editForm.value.is_exist_landing,
      is_exist_creative: editForm.value.is_exist_creative
    }
    
    // Only add these fields if they have non-null values
    if (editForm.value.group_id && editForm.value.group_id !== 'null') {
      payload.group_id = Number(editForm.value.group_id)
    }
    
    if (editForm.value.shipping_method_id && editForm.value.shipping_method_id !== 'null') {
      payload.shipping_method_id = Number(editForm.value.shipping_method_id)
    }
    
    if (editForm.value.tariff_id && editForm.value.tariff_id !== 'null') {
      payload.tariff_id = Number(editForm.value.tariff_id)
    }
    
    // Filter out undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key]
      }
    })
    
    const response = await axios.put(
      `${API_URL}/offers/offer/${offerId}`,
      payload,
      { headers }
    )
    
    if (response.data.status) {
      // Update local state with new data
      Object.assign(offer.value, {
        name: editForm.value.name,
        desc: editForm.value.desc,
        image_url: editForm.value.image_url,
        group_id: editForm.value.group_id,
        shipping_method_id: editForm.value.shipping_method_id,
        tariff_id: editForm.value.tariff_id,
        is_exist_landing: editForm.value.is_exist_landing,
        is_exist_creative: editForm.value.is_exist_creative
      })
      showEditModal.value = false
    } else {
      error.value = response.data.message || 'Failed to update offer'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred while updating offer'
    console.error('Error updating offer:', err)
  } finally {
    saving.value = false
  }
}

const showPaymentModal = ref(false)
const selectedStatus = ref(null)
const statusUpdating = ref(false)
const deleting = ref(false)

// Payment state
const selectedPayment = ref(null)
const isNewPayment = ref(false)

// Fetch offer data
const fetchOffer = async () => {
  try {
    loading.value = true
    const headers = await getAuthHeaders()
    const response = await axios.get(`${API_URL}/offers/offer/${offerId}`, { headers })
    
    if (response.data.status) {
      offer.value = response.data.data
      selectedStatus.value = offer.value.status?.id
    } else {
      error.value = response.data.message || 'Failed to fetch offer details'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    console.error('Error fetching offer:', err)
  } finally {
    loading.value = false
  }
}

// Fetch statuses for dropdown
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
  } catch (err) {
    console.error('Error fetching statuses:', err)
  }
}

// Update offer status
const updateStatus = async () => {
  try {
    statusUpdating.value = true
    const headers = await getAuthHeaders()
    
    const response = await axios.patch(
      `${API_URL}/offers/${offerId}/status`, 
      { status_id: selectedStatus.value }, 
      { headers }
    )
    
    if (response.data.status) {
      // Update local state
      const newStatus = statuses.value.find(s => s.id === selectedStatus.value)
      if (newStatus) {
        offer.value.status = newStatus
      }
      showStatusModal.value = false
    } else {
      error.value = response.data.message || 'Failed to update status'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    console.error('Error updating status:', err)
  } finally {
    statusUpdating.value = false
  }
}

// Delete offer
const deleteOffer = async () => {
  try {
    deleting.value = true
    const headers = await getAuthHeaders()
    
    const response = await axios.delete(`${API_URL}/offers/${offerId}`, { headers })
    
    if (response.data.status) {
      // Redirect to offers list
      router.push('/offers')
    } else {
      error.value = response.data.message || 'Failed to delete offer'
      showDeleteModal.value = false
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    console.error('Error deleting offer:', err)
    showDeleteModal.value = false
  } finally {
    deleting.value = false
  }
}

// Update landing page flag
const updateLanding = async (value) => {
  try {
    const headers = await getAuthHeaders()
    
    const response = await axios.put(
      `${API_URL}/offers/offer/${offerId}`, 
      { is_exist_landing: value }, 
      { headers }
    )
    
    if (response.data.status) {
      offer.value.is_exist_landing = value
    }
  } catch (err) {
    console.error('Error updating landing flag:', err)
    // Revert toggle if failed
    offer.value.is_exist_landing = !value
  }
}

// Update creative flag
const updateCreative = async (value) => {
  try {
    const headers = await getAuthHeaders()
    
    const response = await axios.put(
      `${API_URL}/offers/offer/${offerId}`, 
      { is_exist_creative: value }, 
      { headers }
    )
    
    if (response.data.status) {
      offer.value.is_exist_creative = value
    }
  } catch (err) {
    console.error('Error updating creative flag:', err)
    // Revert toggle if failed
    offer.value.is_exist_creative = !value
  }
}

// Payment actions
const editPayment = (payment) => {
  selectedPayment.value = { ...payment }
  isNewPayment.value = false
  showPaymentModal.value = true
}

const deletePayment = async (paymentId) => {
  if (!confirm('Are you sure you want to delete this payment?')) return
  
  try {
    const headers = await getAuthHeaders()
    const response = await axios.delete(`${API_URL}/offers/payments/${paymentId}`, { headers })
    
    if (response.data.status) {
      // Remove payment from local state
      offer.value.offer_pays = offer.value.offer_pays.filter(p => p.id !== paymentId)
    } else {
      error.value = response.data.message || 'Failed to delete payment'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred while deleting payment'
    console.error('Error deleting payment:', err)
  }
}

const addPayment = () => {
  selectedPayment.value = {}
  isNewPayment.value = true
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedPayment.value = null
}

const savePayment = async (paymentData) => {
  try {
    const headers = await getAuthHeaders()
    
    // Prepare the payload for the unified offer update endpoint
    const payload = {
      // Include only payment-related fields
      sell_price: paymentData.sell_price,
      pay_web: paymentData.pay_web,
      add_manager: paymentData.add_manager,
      two_plus_one: paymentData.two_plus_one,
      fbs: paymentData.fbs,
      pvz: paymentData.pvz,
      free1: paymentData.free1,
      free2: paymentData.free2
    }
    
    // Only add these fields if they have non-null values
    if (paymentData.shipping_method_id && paymentData.shipping_method_id !== 'null') {
      payload.shipping_method_id = paymentData.shipping_method_id
    }
    
    if (paymentData.tariff_id && paymentData.tariff_id !== 'null') {
      payload.tariff_id = paymentData.tariff_id
    }
    
    if (paymentData.group_id && paymentData.group_id !== 'null') {
      payload.group_id = paymentData.group_id
    }
    
    // Filter out undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key]
      }
    })
    
    // Send to the unified offer update endpoint
    const response = await axios.put(
      `${API_URL}/offers/offer/${offerId}`,
      payload,
      { headers }
    )
    
    if (response.data.status) {
      // Refresh offer data to get updated payments
      await fetchOffer()
      closePaymentModal()
    } else {
      error.value = response.data.message || 'Failed to save payment'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred while saving payment'
    console.error('Error saving payment:', err)
  }
}

// Get CSS class for status badge
const getStatusClass = (statusCode) => {
  if (!statusCode) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  
  switch (statusCode.toLowerCase()) {
    case 'open':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    case 'closed':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchOffer()
  fetchStatuses()
})
</script>
