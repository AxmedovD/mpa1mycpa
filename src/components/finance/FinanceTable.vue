<script setup>
import { computed, defineEmits, defineProps } from 'vue'
import Pagination from '../common/Pagination.vue'

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  },
  transfers: {
    type: Array,
    default: () => []
  },
  filters: {
    type: Object,
    default: () => ({
      reasons: [],
      kontragents: [],
      bankAccounts: [],
      search: '',
      types: []
    })
  },
  transactionMeta: {
    type: Object,
    default: () => ({})
  },
  transferMeta: {
    type: Object,
    default: () => ({})
  },
  currentPage: {
    type: Number,
    default: 1
  },
  perPage: {
    type: Number,
    default: 20
  }
})

const emit = defineEmits(['page-change', 'per-page-change'])

const headers = [
  { key: 'id', label: 'ID' },
  { key: 'created_at', label: 'Yaratilgan sana' },
  { key: 'amount', label: 'Summa' },
  { key: 'reason_id', label: "O'tkazma sababi" },
  { key: 'kontragent_id', label: 'Kontragent' },
  { key: 'description', label: 'Izoh' },
  { key: 'updated_at', label: "O'zgartirilgan sana" },
  { key: 'bank_account_id', label: 'Hisob' },
]

// Create lookup maps for faster access
const lookupMaps = computed(() => {
  const bankAccounts = props.filters.bankAccounts || []
  const reasons = props.filters.reasons || []
  const kontragents = props.filters.kontragents || []
  
  
  const bankAccountsMap = new Map()
  bankAccounts.forEach(account => {
    bankAccountsMap.set(Number(account.id), `${account.bank_name} (${account.currency})`)
  })
  return {
    reasons: new Map(reasons.map(r => [Number(r.id), r.name])),
    kontragents: new Map(kontragents.map(k => [Number(k.id), k.name])),
    bankAccounts: bankAccountsMap
  }
})

// Optimize helper functions to use lookup maps
const getBankAccountName = (id) => lookupMaps.value.bankAccounts.get(Number(id)) || '-'
const getReasonName = (id) => lookupMaps.value.reasons.get(Number(id)) || '-'
const getKontragentName = (id) => lookupMaps.value.kontragents.get(Number(id)) || '-'

// Cache number formatter
const numberFormatter = new Intl.NumberFormat('ru-RU')
const formatAmount = (amount, currency) => {
  const cleanAmount = parseFloat(amount)
  if (isNaN(cleanAmount)) return '-'
  return `${numberFormatter.format(cleanAmount)} ${currency}`
}

// Cache date/time formatters
const dateFormatter = new Intl.DateTimeFormat('ru-RU')
const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

const formatDateTime = (datetime) => {
  if (!datetime) return '-'
  
  // Parse DD-MM-YYYY HH:mm:ss to YYYY-MM-DD HH:mm:ss
  const [datePart, timePart] = datetime.split(' ')
  if (!datePart) return '-'
  
  const [day, month, year] = datePart.split('-')
  const isoDateTime = timePart 
    ? `${year}-${month}-${day} ${timePart}`
    : `${year}-${month}-${day}`
    
  const date = new Date(isoDateTime)
  if (isNaN(date.getTime())) return '-'
  
  return `${dateFormatter.format(date)}\n${timeFormatter.format(date)}`
}

const paginationMeta = computed(() => {
  const total = (props.transactionMeta.total || 0) + (props.transferMeta.total || 0)
  const filteredTotal = (props.transactionMeta.filtered_total || 0) + (props.transferMeta.filtered_total || 0)
  
  // Only use lengths when filtered (total != filtered_total)
  const thisPage = total !== filteredTotal 
    ? props.transactions.length + props.transfers.length 
    : Math.min(props.perPage, filteredTotal - (props.currentPage - 1) * props.perPage)

  return {
    current_page: props.currentPage,
    per_page: props.perPage,
    total,
    filtered_total: filteredTotal,
    last_page: Math.max(props.transactionMeta.last_page || 0, props.transferMeta.last_page || 0),
    this_page: thisPage
  }
})

const processTransfers = computed(() => {
  return props.transfers.map(t => ({
    id: t.id,
    display_id: `T-${t.id}`,
    created_at: formatDateTime(t.created_at),
    updated_at: formatDateTime(t.updated_at),
    amount: {
      from: formatAmount(t.from_amount, t.from_currency),
      to: formatAmount(t.to_amount, t.to_currency)
    },
    reason_id: "Hisoblar o'rtasidagi o'tkazma",
    kontragent_id: '-',
    description: t.description || '-',
    raw: t,
    isTransfer: true
  }))
})

const allData = computed(() => {
  // Pre-calculate lookup values for this render
  const maps = lookupMaps.value

  const formattedTransactions = props.transactions.map(t => {
    const bankAccountId = Number(t.bank_account_id)
    return {
      id: t.id,
      display_id: `TR-${t.id}`,
      created_at: formatDateTime(t.created_at),
      updated_at: formatDateTime(t.updated_at),
      type: t.type || 'Transaction',
      amount: formatAmount(t.amount, t.currency),
      reason_id: getReasonName(t.reason_id),
      kontragent_id: getKontragentName(t.kontragent_id),
      bank_account_id: maps.bankAccounts.get(bankAccountId) || '-',
      description: t.description || '-',
      raw: t,
      isTransfer: false
    }
  })

  const formattedTransfers = processTransfers.value.map(t => ({
    id: `transfer-${t.id}`,
    display_id: t.display_id,
    created_at: t.created_at,
    updated_at: t.updated_at,
    type: 'Transfer',
    amount: t.amount,
    reason_id: t.reason_id,
    kontragent_id: t.kontragent_id,
    bank_account_id: `${getBankAccountName(t.raw.from_account_id)} → ${getBankAccountName(t.raw.to_account_id)}`,
    description: t.description,
    raw: t.raw,
    isTransfer: true
  }))

  return [...formattedTransactions, ...formattedTransfers].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at)
  })
})

const filteredData = computed(() => {
  let result = [...allData.value]
  
  // Apply filters
  if (props.filters.search) {
    result = result.filter(item => 
      item.description?.toLowerCase().includes(props.filters.search.toLowerCase())
    )
  }

  if (props.filters.types?.length > 0) {
    result = result.filter(item => props.filters.types.includes(item.type))
  }

  return result
})

const onPageChange = (page) => {
  emit('page-change', page)
}

const onPerPageChange = (newPerPage) => {
  emit('per-page-change', newPerPage)
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-if="filteredData.length === 0">
          <td :colspan="headers.length" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            No financial records found
          </td>
        </tr>
        <tr 
          v-for="item in filteredData" 
          :key="item.id" 
          class="hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {{ item.display_id }}
          </td>
          <td class="px-6 py-4 whitespace-pre text-sm text-gray-900 dark:text-white">
            {{ item.created_at }}
          </td>
          
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <template v-if="item.isTransfer">
              <div class="text-red-600 dark:text-red-400">{{ item.amount.from }}</div>
              <div class="text-green-600 dark:text-green-400">{{ item.amount.to }}</div>
            </template>
            <template v-else>
              <span :class="{
                'text-green-600 dark:text-green-400': item.type === 'in',
                'text-red-600 dark:text-red-400': item.type === 'out'
              }">{{ item.amount }}</span>
            </template>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <template v-if="item.isTransfer">
              <span class="text-blue-600 dark:text-blue-400 font-medium">{{ item.reason_id }}</span>
            </template>
            <template v-else>
              <span class="text-gray-900 dark:text-white">{{ item.reason_id }}</span>
            </template>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {{ item.kontragent_id }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-900 dark:text-white min-w-[200px]">
            {{ item.description }}
          </td>
          <td class="px-6 py-4 whitespace-pre text-sm text-gray-500 dark:text-gray-400">
            {{ item.updated_at }}
          </td>
          <td class="px-6 py-4 whitespace-normal text-sm text-gray-900 dark:text-white">
            <template v-if="item.isTransfer">
              <div class="text-red-600 dark:text-red-400">{{ getBankAccountName(item.raw.from_account_id) }}</div>
              <div class="text-green-600 dark:text-green-400">{{ getBankAccountName(item.raw.to_account_id) }}</div>
            </template>
            <template v-else>
              {{ getBankAccountName(item.raw.bank_account_id) }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4">
      <Pagination
        :meta="paginationMeta"
        @page-change="onPageChange"
        @per-page-change="onPerPageChange"
      />
    </div>
  </div>
</template>