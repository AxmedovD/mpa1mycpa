<template>
  <div class="relative">
    <!-- Table -->
    <div class="overflow-x-auto" ref="tableContainer">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <!-- Select All Checkbox -->
            <th class="px-4 py-2">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
                class="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              >
            </th>
            <th @click="handleSort('id')" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center space-x-1">
                <span>ID</span>
                <SortIcon :active="sortBy === 'id'" :direction="sortBy === 'id' ? sortDirection : null" />
              </div>
            </th>
            <th @click="handleSort('created_at')" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center space-x-1">
                <span>Yaratilgan sanasi</span>
                <SortIcon :active="sortBy === 'created_at'" :direction="sortBy === 'created_at' ? sortDirection : null" />
              </div>
            </th>
            <th @click="handleSort('order_id')" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center space-x-1">
                <span>Buyurtma raqami</span>
                <SortIcon :active="sortBy === 'order_id'" :direction="sortBy === 'order_id' ? sortDirection : null" />
              </div>
            </th>
            <th @click="handleSort('invoice_id')" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center space-x-1">
                <span>Nakladnoy</span>
                <SortIcon :active="sortBy === 'invoice_id'" :direction="sortBy === 'invoice_id' ? sortDirection : null" />
              </div>
            </th>
            <th @click="handleSort('store')" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center space-x-1">
                <span>Do'kon</span>
                <SortIcon :active="sortBy === 'store'" :direction="sortBy === 'store' ? sortDirection : null" />
              </div>
            </th>
            <th @click="handleSort('product')" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center space-x-1">
                <span>Mahsulot</span>
                <SortIcon :active="sortBy === 'product'" :direction="sortBy === 'product' ? sortDirection : null" />
              </div>
            </th>
            <th @click="handleSort('article')" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center space-x-1">
                <span>Artikul</span>
                <SortIcon :active="sortBy === 'article'" :direction="sortBy === 'article' ? sortDirection : null" />
              </div>
            </th>
            <th @click="handleSort('sku')" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center space-x-1">
                <span>SKU</span>
                <SortIcon :active="sortBy === 'sku'" :direction="sortBy === 'sku' ? sortDirection : null" />
              </div>
            </th>
            <th @click="handleSort('uzum_sku')" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center space-x-1">
                <span>Uzum SKU</span>
                <SortIcon :active="sortBy === 'uzum_sku'" :direction="sortBy === 'uzum_sku' ? sortDirection : null" />
              </div>
            </th>
            <th @click="handleSort('sell_price')" class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center justify-end space-x-1">
                <span>Sotuv narxi</span>
                <SortIcon :active="sortBy === 'sell_price'" :direction="sortBy === 'sell_price' ? sortDirection : null" />
              </div>
            </th>
            <th @click="handleSort('buy_price')" class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center justify-end space-x-1">
                <span>Xarid narxi</span>
                <SortIcon :active="sortBy === 'buy_price'" :direction="sortBy === 'buy_price' ? sortDirection : null" />
              </div>
            </th>
            <th @click="handleSort('quantity')" class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center justify-end space-x-1">
                <span>Miqdor</span>
                <SortIcon :active="sortBy === 'quantity'" :direction="sortBy === 'quantity' ? sortDirection : null" />
              </div>
            </th>
            <th @click="handleSort('processed')" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center space-x-1">
                <span>Holati</span>
                <SortIcon :active="sortBy === 'processed'" :direction="sortBy === 'processed' ? sortDirection : null" />
              </div>
            </th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Izoh</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="shipment in shipments"
            :key="shipment.id"
            :class="[
              'transition-colors duration-150',
              isEditable(shipment) ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : 'opacity-75'
            ]"
            @click="handleRowClick(shipment)"
          >
            <!-- Row Checkbox -->
            <td class="px-4 py-2" @click.stop>
              <input
                type="checkbox"
                :checked="selectedItems.includes(shipment.id)"
                :disabled="!isEditable(shipment)"
                @change="toggleSelect(shipment.id)"
                @click.stop
                class="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 disabled:opacity-50"
              >
            </td>
            <td class="px-4 py-2 text-gray-900 dark:text-gray-200">
              <CopyableText :text="shipment.id.toString()" />
            </td>
            <td class="px-4 py-2 text-gray-900 dark:text-gray-200">
              <div class="whitespace-nowrap">{{ formatDate(shipment.created_at) }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatTime(shipment.created_at) }}</div>
            </td>
            <td class="px-4 py-2 text-gray-900 dark:text-gray-200">
              <CopyableText :text="shipment.order_id || shipment.order_no" />
            </td>
            <td class="px-4 py-2 text-gray-900 dark:text-gray-200">
              <CopyableText :text="shipment.invoice_id ? shipment.invoice_id.toString() : ''" />
            </td>
            <td class="px-4 py-2 text-gray-900 dark:text-gray-200 whitespace-nowrap">
              <CopyableText :text="shipment.store" />
            </td> 
            <td class="px-4 py-2 text-gray-900 dark:text-gray-200 min-w-[24rem] max-w-[24rem]">
              <div class="break-words">{{ shipment.product }}</div>
            </td>
            <td class="px-4 py-2 text-gray-900 dark:text-gray-200 whitespace-nowrap">
              <CopyableText :text="shipment.article" />
            </td>
            <td class="px-4 py-2 text-gray-900 dark:text-gray-200 whitespace-nowrap">
              <CopyableText :text="shipment.sku" />
            </td>
            <td class="px-4 py-2 text-gray-900 dark:text-gray-200 whitespace-nowrap">
              <CopyableText :text="shipment.uzum_sku" />
              <span v-if="shipment.uzum_sku_title" class="text-sm text-gray-500 dark:text-gray-400 block">
                {{ shipment.uzum_sku_title }}
              </span>
            </td>
            <td class="px-4 py-2 text-right text-gray-900 dark:text-gray-200 whitespace-nowrap">{{ formatPrice(shipment.sell_price) }} UZS</td>
            <td class="px-4 py-2 text-right text-gray-900 dark:text-gray-200 whitespace-nowrap">{{ formatPrice(shipment.buy_price) }} UZS</td>
            <td class="px-4 py-2 text-right text-gray-900 dark:text-gray-200">{{ shipment.quantity }}</td>
            <td class="px-4 py-2">
              <span 
                :class="{
                  'px-2 py-1 rounded text-sm': true,
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': shipment.processed === 'sold' || shipment.processed === 'to_sold',
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': shipment.processed === 'returned' || shipment.processed === 'to_returned',
                  'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200': shipment.processed === 'brak' || shipment.processed === 'to_brak',
                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200': !shipment.processed
                }"
              >
                {{ formatProcessedStatus(shipment.processed) }}
              </span>
            </td>
            <td class="px-4 py-2 text-gray-900 dark:text-gray-200">{{ shipment.order_method }}</td>
            <td class="px-4 py-2 text-gray-900 dark:text-gray-200">{{ shipment.desc }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4">
      <Pagination 
        :meta="meta"
        @page-change="handlePageChange"
        @per-page-change="handlePerPageChange"
      />
    </div>

    <!-- Bulk Actions Panel -->
    <div v-if="selectedItems.length > 0"
         class="fixed bottom-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 transform transition-transform duration-200 z-50"
         :class="{'translate-y-0': selectedItems.length > 0, 'translate-y-full': selectedItems.length === 0}"
         :style="isMobile ? { left: '0', width: '100%' } : { width: tableWidth + 'px', left: tableLeft + 'px' }"
    >
      <!-- Mobile Layout -->
      <div v-if="isMobile" class="p-4">
        <div class="flex flex-col space-y-4">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ selectedItems.length }} items selected
          </div>
          <select
            v-model="selectedAction"
            class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm"
          >
            <option value="">Select Action</option>
            <option value="status_to_sold">Mark as Sotilgan</option>
            <option value="status_to_returned">Mark as Qaytarilgan</option>
            <option value="status_to_brak">Mark as Brak</option>
            <option value="delete">Delete Selected</option>
          </select>
          <div class="flex flex-col space-y-2">
            <button
              @click="applyBulkAction"
              :disabled="!selectedAction || isProcessing"
              class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isProcessing" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else>Apply</span>
            </button>
            <button
              @click="clearSelection"
              class="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Layout -->
      <div v-else class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ selectedItems.length }} items selected
            </span>
            
            <div class="relative">
              <select
                v-model="selectedAction"
                class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-8 text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Action</option>
                <optgroup label="Status Changes">
                  <option value="status_to_sold">Mark as Sotilgan</option>
                  <option value="status_to_returned">Mark as Qaytarilgan</option>
                  <option value="status_to_brak">Mark as Brak</option>
                </optgroup>
                <optgroup label="Danger Zone">
                  <option value="delete">Delete Selected</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="clearSelection"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              @click="applyBulkAction"
              :disabled="!selectedAction || isProcessing"
              :class="{
                'px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150': true,
                'bg-blue-600 text-white hover:bg-blue-700': selectedAction && !selectedAction.startsWith('delete'),
                'bg-red-600 text-white hover:bg-red-700': selectedAction?.startsWith('delete'),
                'opacity-50 cursor-not-allowed': !selectedAction || isProcessing
              }"
            >
              <span v-if="isProcessing" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else>Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, defineEmits } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import Pagination from '../common/Pagination.vue'
import CopyableText from '../common/CopyableText.vue'
import { useShipmentData } from '../../composables/useShipmentData'
import { getAuthHeaders } from '../../services/auth'
import { API_URL } from '../../config/api'
import { useRouter } from 'vue-router'

const toast = useToast()
const selectedItems = ref([])
const selectedAction = ref('')
const isProcessing = ref(false)

// Mobile detection
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['sortChange'])

const {
  shipments,
  meta,
  loading,
  error,
  fetchShipments,
  handlePageChange,
  handlePerPageChange,
  applyFilters,
  resetFilters
} = useShipmentData()

// Fetch initial data
onMounted(() => {
  fetchShipments()
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const isAllSelected = computed(() => {
  return shipments.value.length > 0 && selectedItems.value.length === shipments.value.length
})

const formatProcessedStatus = (status) => {
  const statusMap = {
    'sold': 'Sotilgan',
    'to_sold': 'Sotilgan',
    'returned': 'Qaytarilgan',
    'to_returned': 'Qaytarilgan',
    'brak': 'Brak',
    'to_brak': 'Brak',
    'is_null': 'Yangi'
  }
  return statusMap[status] || 'Yangi'
}

const sortBy = ref(null)
const sortDirection = ref(null)

const ALLOWED_ORDER_METHODS = ['zoodmall', 'Ofis', 'fba', 'fbs']

const isEditable = (shipment) => {
  return ALLOWED_ORDER_METHODS.includes(shipment.order_method)
}

const handleSort = (field) => {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortDirection.value = 'asc'
  }
  // Combine current filters with sort parameters
  const combinedParams = {
    ...props.filters,  // Keep all current filters
    sortBy: sortBy.value,
    sortDirection: sortDirection.value
  }
  emit('sortChange', { sortBy: sortBy.value, sortDirection: sortDirection.value })
  applyFilters(combinedParams)  // Apply both filters and sort
}

// Modify the watch to only reset sort on explicit filter reset
watch(() => props.filters, (newFilters) => {
  const isFiltersEmpty = Object.values(newFilters).every(val => !val)
  if (isFiltersEmpty && !props.preserveSort) {
    sortBy.value = null
    sortDirection.value = null
    emit('sortChange', { sortBy: null, sortDirection: null })
  }
}, { deep: true })

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = shipments.value.map(s => s.id)
  }
}

const toggleSelect = (id) => {
  const shipment = shipments.value.find(s => s.id === id)
  if (isEditable(shipment)) {
    const index = selectedItems.value.indexOf(id)
    if (index === -1) {
      selectedItems.value.push(id)
    } else {
      selectedItems.value.splice(index, 1)
    }
  }
}

const clearSelection = () => {
  selectedItems.value = []
  selectedAction.value = ''
}

const applyBulkAction = async () => {
  if (!selectedAction.value || isProcessing.value || selectedItems.value.length === 0) return

  try {
    isProcessing.value = true

    if (selectedAction.value === 'delete') {
      // Show confirmation dialog
      if (!confirm(`Ishonchingiz komilmi? Ochirilgan buyurtmalar qaytarilmaydi ${selectedItems.value.length} ta?`)) {
        return
      }

      console.log('Sending delete request with ids:', selectedItems.value)

      const response = await axios.delete(`${API_URL}/shipments/send/delete`, {
        data: { 
          ids: selectedItems.value.map(id => parseInt(id, 10))
        },
        headers: await getAuthHeaders()
      })

      console.log('Delete response:', response.data)

      if (response.data.status) {
        toast.success(response.data.message)
        clearSelection()
        fetchShipments() // Refresh the list
      } else {
        toast.error(response.data.message || 'Xatolik yuz berdi')
      }
    } else {
      // Handle status changes
      const processed = selectedAction.value.replace('status_', '')
      console.log('Sending status update request:', {
        processed,
        shipments: selectedItems.value.map(id => ({ id: parseInt(id, 10), processed }))
      })

      const response = await axios.put(
        `${API_URL}/shipments/send/status`,
        {
          shipments: selectedItems.value.map(id => ({
            id: parseInt(id, 10),
            processed
          }))
        },
        { headers: await getAuthHeaders() }
      )

      console.log('Update response:', response.data)

      if (response.data.status) {
        toast.success(response.data.message)
        if (response.data.errors && response.data.errors.length > 0) {
          console.warn('Some updates had errors:', response.data.errors)
          toast.warning(`${response.data.success_count} updated, ${response.data.errors.length} failed`)
        }
        clearSelection()
        fetchShipments() // Refresh the list
      } else {
        toast.error(response.data.message || "Holatini o'zgartirishda xatolik yuz berdi")
        if (response.data.errors) {
          console.error('Update errors:', response.data.errors)
        }
      }
    }
  } catch (error) {
    console.error('Bulk action error:', error)
    if (error.response) {
      console.error('Error response:', error.response.data)
      toast.error(error.response.data?.message || 'Server error occurred')
    } else if (error.request) {
      console.error('Error request:', error.request)
      toast.error('Network error occurred')
    } else {
      console.error('Error:', error.message)
      toast.error('An unexpected error occurred')
    }
  } finally {
    isProcessing.value = false
  }
}

const router = useRouter()

const handleRowClick = (shipment) => {
  if (isEditable(shipment)) {
    router.push(`/shipment/create/${shipment.id}`)
  }
}

// Table width tracking
const tableContainer = ref(null)
const tableWidth = ref(0)
const tableLeft = ref(0)

const updateTableDimensions = () => {
  if (tableContainer.value) {
    const rect = tableContainer.value.getBoundingClientRect()
    tableWidth.value = rect.width
    tableLeft.value = rect.left
  }
}

// Update dimensions on mount and window resize
onMounted(() => {
  updateTableDimensions()
  window.addEventListener('resize', updateTableDimensions)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTableDimensions)
})

// Watch for filter changes
watch(() => props.filters, (newFilters) => {
  if (newFilters === null) {
    resetFilters()
  } else {
    applyFilters(newFilters)
  }
}, { deep: true })

const formatPrice = (price) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

const formatDate = (datetime) => {
  if (!datetime) return ''
  const date = new Date(datetime)
  return new Intl.DateTimeFormat('uz-UZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

const formatTime = (datetime) => {
  if (!datetime) return ''
  const date = new Date(datetime)
  return new Intl.DateTimeFormat('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style scoped>
.bulk-actions-enter-active,
.bulk-actions-leave-active {
  transition: transform 0.3s ease-in-out;
}

.bulk-actions-enter-from,
.bulk-actions-leave-to {
  transform: translateY(100%);
}
</style>
