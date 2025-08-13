<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
    <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ isNew ? 'Add New Payment' : 'Edit Payment' }}
        </h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- IDs section: Shipping Method, Tariff, Group, Add Manager - 2x2 grid -->
           <!-- Price section: Sell Price and Pay Web - side by side -->
           <div class="grid grid-cols-2 gap-4">
            <!-- Sell Price -->
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
            
            <!-- Pay Web -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pay Web</label>
              <input 
                v-model="formData.pay_web" 
                type="number" 
                step="0.01" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Shipping Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shipping Method ID</label>
              <input 
                v-model="formData.shipping_method_id" 
                type="number" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <!-- Tariff ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tariff ID</label>
              <input 
                v-model="formData.tariff_id" 
                type="number" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <!-- Group ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group ID</label>
              <input 
                v-model="formData.group_id" 
                type="number" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <!-- Add Manager -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add Manager</label>
              <input 
                v-model="formData.add_manager" 
                type="number" 
                step="0.01" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>
          
          <!-- Options section -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-md p-4">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Options</h4>
            
            <div class="grid grid-cols-2 gap-4">
              <!-- 2+1 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">2+1</label>
                <select
                  v-model="formData.two_plus_one"
                  class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Bor">Bor</option>
                  <option value="Yoq">Yoq</option>
                </select>
              </div>
              
              <!-- PVZ -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PVZ</label>
                <select
                  v-model="formData.pvz"
                  class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Bor">Bor</option>
                  <option value="Yoq">Yoq</option>
                </select>
              </div>
              
              <!-- FBS -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">FBS</label>
                <select
                  v-model="formData.fbs"
                  class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Bor">Bor</option>
                  <option value="Yoq">Yoq</option>
                </select>
              </div>
              
              <!-- Free1 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Free1</label>
                <select
                  v-model="formData.free1"
                  class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Bor">Bor</option>
                  <option value="Yoq">Yoq</option>
                </select>
              </div>
              
              <!-- Free2 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Free2</label>
                <select
                  v-model="formData.free2"
                  class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Bor">Bor</option>
                  <option value="Yoq">Yoq</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              type="button"
              @click="$emit('close')" 
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
              {{ isNew ? 'Add Payment' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const props = defineProps({
  payment: {
    type: Object,
    default: () => ({})
  },
  isNew: {
    type: Boolean,
    default: false
  },
  offerId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['save', 'close'])

// Form data with default values
const formData = reactive({
  shipping_method_id: 0,
  tariff_id: null,
  group_id: null,
  sell_price: 0,
  pay_web: 0,
  add_manager: 0,
  two_plus_one: 'Yoq',
  pvz: 'Yoq',
  fbs: 'Yoq',
  free1: 'Yoq',
  free2: 'Yoq'
})

const saving = ref(false)

// Initialize form with payment data if editing
onMounted(() => {
  if (!props.isNew && props.payment) {
    Object.keys(formData).forEach(key => {
      if (props.payment[key] !== undefined) {
        formData[key] = props.payment[key]
      }
    })
  }
})

// Handle form submission
const handleSubmit = () => {
  saving.value = true
  
  // Create payload with offer_id
  const payload = {
    ...formData,
    offer_id: props.offerId
  }
  
  // If editing, include the payment ID
  if (!props.isNew && props.payment?.id) {
    payload.id = props.payment.id
  }
  
  // Emit save event with payload
  emit('save', payload)
}
</script>
