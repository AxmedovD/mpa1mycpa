<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
    <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit Variant</h3>
        
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Variant Name</label>
              <div class="text-gray-900 dark:text-white">{{ formData.name }}</div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
              <div class="text-gray-900 dark:text-white">{{ formData.sku }}</div>
            </div>
            
            <div>
              <label for="buy-price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buy Price</label>
              <input 
                type="number" 
                id="buy-price" 
                v-model.number="formData.buy_price" 
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label for="sell-price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sell Price</label>
              <input 
                type="number" 
                id="sell-price" 
                v-model.number="formData.sell_price" 
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              type="button"
              @click="close" 
              class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="saving" 
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { getAuthHeaders } from '../../../services/auth'

const API_URL = import.meta.env.VITE_API_URL

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  variant: {
    type: Object,
    default: () => ({})
  },
  offerId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

// Form data
const formData = reactive({
  id: null,
  name: '',
  sku: '',
  buy_price: 0,
  sell_price: 0
})

const saving = ref(false)

// Initialize form with variant data
onMounted(() => {
  if (props.variant) {
    Object.keys(formData).forEach(key => {
      if (props.variant[key] !== undefined) {
        formData[key] = props.variant[key]
      }
    })
  }
})

// Handle form submission
const handleSubmit = async () => {
  try {
    saving.value = true
    const headers = await getAuthHeaders()
    
    // Prepare the payload for the unified offer update endpoint
    const payload = {
      product_variants: [
        {
          variant_id: formData.id,
          buy_price: formData.buy_price,
          sell_price: formData.sell_price
        }
      ]
    }
    
    // Send to the unified offer update endpoint
    const response = await axios.put(
      `/api/admin/offers/offer/${props.offerId}`, 
      payload,
      { headers }
    )
    
    if (response.data.status) {
      // Create an updated variant object that includes the name and other fields
      // that weren't sent to the API but need to be updated in the UI
      const updatedVariant = {
        ...formData
      }
      
      emit('updated', updatedVariant)
      close()
    }
  } catch (error) {
    console.error('Error updating variant:', error)
  } finally {
    saving.value = false
  }
}

// Close modal
const close = () => {
  emit('close')
}
</script>
