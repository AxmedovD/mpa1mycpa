<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" @click="close">
        <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
      </div>

      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Edit Product
          </h3>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Product Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
              <input 
                v-model="formData.name" 
                type="text" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <!-- Buy Price and Sell Price -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buy Price</label>
                <input 
                  v-model="formData.buy_price" 
                  type="number" 
                  step="0.01" 
                  class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sell Price</label>
                <input 
                  v-model="formData.sell_price" 
                  type="number" 
                  step="0.01" 
                  class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>
            
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button 
                type="submit" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save Changes
              </button>
              <button 
                type="button" 
                @click="close" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { getAuthHeaders } from '@/services/auth'

const API_URL = import.meta.env.VITE_API_URL

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  product: {
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
const formData = ref({
  name: '',
  sku: '',
  article: '',
  buy_price: 0,
  sell_price: 0,
  id: null
})

// Initialize form data when product changes
watch(() => props.product, (newProduct) => {
  if (newProduct && props.isVisible) {
    formData.value = {
      name: newProduct.name || '',
      sku: newProduct.sku || '',
      article: newProduct.article || '',
      buy_price: newProduct.buy_price || 0,
      sell_price: newProduct.sell_price || 0,
      id: newProduct.id
    }
  }
}, { immediate: true })

// Handle form submission
const handleSubmit = async () => {
  try {
    const headers = await getAuthHeaders()
    
    // Prepare the payload for the unified offer update endpoint
    const payload = {
      products: [
        {
          p_product_id: formData.value.id,
          buy_price: formData.value.buy_price,
          sell_price: formData.value.sell_price
        }
      ]
    }
    
    // Send to the unified offer update endpoint
    const response = await axios.put(
      `/offers/offer/${props.offerId}`, 
      payload,
      { headers }
    )
    
    if (response.data.status) {
      // Create an updated product object that includes the name and other fields
      // that weren't sent to the API but need to be updated in the UI
      const updatedProduct = {
        ...formData.value
      }
      
      emit('updated', updatedProduct)
      close()
    }
  } catch (error) {
    console.error('Error updating product:', error)
  }
}

// Close modal
const close = () => {
  emit('close')
}
</script>
