<template>
  <div>
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      :class="{ 'opacity-100': show, 'opacity-0': !show }"
      @click="$emit('close')"
    ></div>

    <!-- Form -->
    <div 
      class="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 z-50 flex flex-col"
      :class="{ 'translate-x-0': show, 'translate-x-full': !show }"
    >
      <!-- Header -->
      <div class="flex-shrink-0 flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ type === 'in' ? 'Kirim' : 'Chiqim' }}</h2>
        <button 
          @click="$emit('close')" 
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto">
        <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <!-- Bank Account -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hisoblar</label>
            <select
              v-model="form.bank_account_id"
              required
              class="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm text-sm sm:text-base"
            >
              <option value="">Hisobni tanlang</option>
              <option 
                v-for="account in bankAccounts" 
                :key="account.id" 
                :value="account.id"
              >
                {{ account.bank_name }} ({{ new Intl.NumberFormat('uz-UZ').format(account.balance) }} {{ account.currency }})
              </option>
            </select>
          </div>
          
          <!-- Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summa</label>
            <input
              :value="formatAmount(form.amount)"
              @input="form.amount = $event.target.value"
              type="text"
              pattern="[\d\s]*"
              inputmode="numeric"
              required
              class="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm text-sm sm:text-base"
              placeholder="Enter amount"
            />
          </div>

          <!-- Reason -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">O'tkazma sababi</label>
            <select
              v-model="form.reason_id"
              required
              class="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm text-sm sm:text-base"
            >
              <option value="">O'tkazma sababini tanlang</option>
              <option 
                v-for="reason in reasons" 
                :key="reason.id" 
                :value="reason.id"
              >
                {{ reason.name }}
              </option>
            </select>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Izoh</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm resize-none text-sm sm:text-base"
              placeholder="Izohni kiriting"
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex-shrink-0 px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <span v-if="isSubmitting">Yaratilyapti...</span>
              <span v-else>Yaratish</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { API_URL } from '../../services/api'
import { getAuthHeaders } from '../../services/auth'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'in'
  }
})

const emit = defineEmits(['close', 'transaction-created'])

const isSubmitting = ref(false)
const bankAccounts = ref([])
const reasons = ref([])

const form = ref({
  amount: '',
  bank_account_id: '',
  reason_id: '',
  description: ''
})

// Format number with spaces
const formatAmount = (value) => {
  if (!value) return ''
  // Remove non-digit characters
  const number = value.toString().replace(/\D/g, '')
  // Format with spaces
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

// Parse formatted number back to raw number
const parseAmount = (value) => {
  if (!value) return ''
  return value.toString().replace(/\s/g, '')
}

const fetchBankAccounts = async () => {
  try {
    const response = await axios.get(`${API_URL}/bankAccount/get`, {
      headers: await getAuthHeaders()
    })
    bankAccounts.value = Array.isArray(response.data) ? response.data : response.data.data || []
  } catch (error) {
    console.error('Error fetching bank accounts:', error)
  }
}

const user = ref(null)
const fetchUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: await getAuthHeaders()
    })
    user.value = response.data
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

const fetchReasons = async () => {
  try {
    const response = await axios.get(`${API_URL}/reasons/${props.type}`, {
      headers: await getAuthHeaders(),
      params: {
        group_id: user.value?.type === 'storekeeper' ? 49 : undefined
      }
    })
    reasons.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching reasons:', error)
  }
}

// Fetch reasons when type changes
watch(() => props.type, () => {
  fetchReasons()
  // Reset reason when type changes
  form.value.reason_id = ''
})

const handleSubmit = async () => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    const response = await axios.post(
      `${API_URL}/transactions/transaction/${props.type}/create`,
      {
        ...form.value,
        amount: parseAmount(form.value.amount),
        type: props.type
      },
      {
        headers: await getAuthHeaders()
      }
    )

    emit('transaction-created', response.data)
    emit('close')
    form.value = {
      amount: '',
      bank_account_id: '',
      reason_id: '',
      description: ''
    }
  } catch (error) {
    console.error('Error creating transaction:', error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchBankAccounts()
  fetchUserData().then(() => fetchReasons())
})
</script>
