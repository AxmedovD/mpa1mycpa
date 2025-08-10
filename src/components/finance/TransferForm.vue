<template>
  <div>
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="$emit('close')"
    ></div>

    <!-- Form -->
    <div 
      class="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white dark:bg-gray-800 shadow-lg transform z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="flex-shrink-0 flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">O'tkazma yaratish</h2>
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
          <!-- Bank Accounts Selection -->
          <div class="flex space-x-4">
            <!-- From Account -->
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hisobdan</label>
              <select 
                v-model="form.from_account_id"
                required
                class="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm text-sm sm:text-base"
              >
                <option value="">Tanlang...</option>
                <option v-for="account in bankAccounts" :key="account.id" :value="account.id">
                  {{ account.bank_name }} ({{ account.currency }}) - {{ formatNumber(account.balance) }}
                </option>
              </select>
            </div>

            <!-- To Account -->
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hisobga</label>
              <select 
                v-model="form.to_account_id"
                required
                class="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm text-sm sm:text-base"
              >
                <option value="">Tanlang...</option>
                <option 
                  v-for="account in availableToAccounts" 
                  :key="account.id" 
                  :value="account.id"
                >
                  {{ account.bank_name }} ({{ account.currency }}) - {{ formatNumber(account.balance) }}
                </option>
              </select>
            </div>
          </div>

          <!-- Amount Fields -->
          <template v-if="selectedFromAccount && selectedToAccount">
            <div v-if="sameCurrency" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Summa ({{ selectedFromAccount.currency }})
              </label>
              <input
                type="text"
                :value="formatInputAmount(form.from_amount)"
                @input="handleFromAmountInput"
                required
                class="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm text-sm sm:text-base"
              >
            </div>
            <div v-else class="space-y-4">
              <!-- From Amount -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Summa ({{ selectedFromAccount.currency }})
                </label>
                <input
                  type="text"
                  :value="formatInputAmount(form.from_amount)"
                  @input="handleFromAmountInput"
                  required
                  class="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm text-sm sm:text-base"
                >
              </div>
              <!-- To Amount -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Summa ({{ selectedToAccount.currency }})
                </label>
                <input
                  type="text"
                  :value="formatInputAmount(form.to_amount)"
                  @input="handleToAmountInput"
                  required
                  class="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm text-sm sm:text-base"
                >
              </div>
            </div>
          </template>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Izoh</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm text-sm sm:text-base"
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
              :disabled="loading"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <span v-if="loading">Saqlanmoqda...</span>
              <span v-else>Saqlash</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { useUser } from '../../services/user'

const emit = defineEmits(['close', 'transfer-created'])
const toast = useToast()
const { user, isSuperAdmin } = useUser()

const loading = ref(false)
const bankAccounts = ref([])

const form = ref({
  from_account_id: '',
  from_amount: '',
  to_account_id: '',
  to_amount: '',
  description: ''
})

// Computed properties for selected accounts
const selectedFromAccount = computed(() => {
  return bankAccounts.value.find(account => account.id === form.value.from_account_id)
})

const selectedToAccount = computed(() => {
  return bankAccounts.value.find(account => account.id === form.value.to_account_id)
})

// Check if both accounts have the same currency
const sameCurrency = computed(() => {
  if (!selectedFromAccount.value || !selectedToAccount.value) return false
  return selectedFromAccount.value.currency === selectedToAccount.value.currency
})

// Available accounts for "to" select (excluding selected "from" account)
const availableToAccounts = computed(() => {
  return bankAccounts.value.filter(account => account.id !== form.value.from_account_id)
})

// Watch for currency changes
watch(sameCurrency, (newValue) => {
  if (newValue) {
    // If same currency, copy from_amount to to_amount
    form.value.to_amount = form.value.from_amount
  }
})

watch(() => form.value.from_amount, (newValue) => {
  if (sameCurrency.value) {
    form.value.to_amount = newValue
  }
})

const fetchBankAccounts = async () => {
  try {
    const endpoint = isSuperAdmin.value ? '/allBankAccount/get' : '/bankAccount/get'
    const response = await axios.get(`https://api.mgoods.uz/api${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    })
    if (response.data.status) {
      bankAccounts.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching bank accounts:', error)
    toast.error('Bank hisoblarini yuklashda xatolik yuz berdi')
  }
}

const handleSubmit = async () => {
  if (form.value.from_account_id === form.value.to_account_id) {
    toast.error('Bir xil hisobga o\'tkazma qilib bo\'lmaydi')
    return
  }

  loading.value = true
  try {
    const response = await axios.post(`https://api.mgoods.uz/api/transfers/transfer/create`, form.value, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    })

    if (response.data.status) {
      toast.success('O\'tkazma muvaffaqiyatli yaratildi')
      emit('transfer-created', response.data)
      emit('close')
    }
  } catch (error) {
    console.error('Error creating transfer:', error)
    toast.error(error.response?.data?.message || 'O\'tkazma yaratishda xatolik yuz berdi')
  } finally {
    loading.value = false
  }
}

// Format number with commas
const formatNumber = (number) => {
  return new Intl.NumberFormat('uz-UZ').format(number)
}

// Format input amount with spaces
const formatInputAmount = (value) => {
  if (!value) return ''
  // Remove any non-digit characters
  const number = value.toString().replace(/\D/g, '')
  // Add spaces between thousands
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

// Handle amount input with formatting
const handleFromAmountInput = (event) => {
  // Get raw value (numbers only)
  const rawValue = event.target.value.replace(/\D/g, '')
  form.value.from_amount = rawValue
}

const handleToAmountInput = (event) => {
  // Get raw value (numbers only)
  const rawValue = event.target.value.replace(/\D/g, '')
  form.value.to_amount = rawValue
}

fetchBankAccounts()
</script>
