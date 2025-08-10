<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <div 
      v-for="account in accounts" 
      :key="account.id"
      class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 whitespace-nowrap overflow-hidden"
    >
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-base font-medium text-gray-900 dark:text-white truncate">{{ account.bank_name }}</h3>
        <span 
          class="text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
          :class="account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
        >
          {{ account.status }}
        </span>
      </div>
      <div class="flex items-baseline space-x-1">
        <span 
          class="text-xl font-bold truncate"
          :class="getBalanceClass(account.balance)"
        >
          {{ formatCurrency(account.balance) }}
        </span>
        <span class="text-sm text-gray-500 flex-shrink-0">{{ account.currency }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { API_URL } from '../../services/api'
import { getAuthHeaders } from '../../services/auth'

const accounts = ref([])

const formatCurrency = (value) => {
  // Parse the string value to float first
  const numValue = parseFloat(value)
  if (isNaN(numValue)) return '0'
  return new Intl.NumberFormat('uz-UZ').format(numValue)
}

const getBalanceClass = (balance) => {
  const numValue = parseFloat(balance)
  if (isNaN(numValue)) return 'text-gray-600'
  if (numValue > 0) return 'text-green-600 dark:text-green-400'
  if (numValue < 0) return 'text-red-600 dark:text-red-400'
  return 'text-gray-600 dark:text-gray-400'
}

const fetchAccounts = async () => {
  try {
    const response = await axios.get(`${API_URL}/bankAccount/get`, {
      headers: await getAuthHeaders()
    })
    accounts.value = Array.isArray(response.data) ? response.data : response.data.data || []
  } catch (error) {
    console.error('Error fetching bank accounts:', error)
    accounts.value = []
  }
}

onMounted(() => {
  fetchAccounts()
})
</script>
