<template>
  <div class="shipments-filter">
    <!-- Filter Header -->
    <div class="flex justify-between items-center mb-4 px-6 pt-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Filterlar</h3>
      <button
        @click="toggleExpanded"
        class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        <svg
          class="w-6 h-6 transform transition-transform duration-200"
          :class="{ 'rotate-180': !isExpanded }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <!-- Filter Content -->
    <div v-show="isExpanded" class="px-6 pb-4">
      <form @submit.prevent="applyFilters" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <!-- Text inputs -->
          <div v-for="field in textFields" :key="field.key" class="form-group">
            <label :for="field.key" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ field.label }}
            </label>
            <input
              :id="field.key"
              type="text"
              v-model="filters[field.key]"
              :placeholder="field.placeholder"
              @keyup.enter="applyFilters"
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition duration-150 ease-in-out"
            />
          </div>

          <!-- Select inputs -->
          <div v-for="field in selectFields" :key="field.key" class="form-group">
            <label :for="field.key" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ field.label }}
            </label>
            <select
              :id="field.key"
              v-model="filters[field.key]"
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition duration-150 ease-in-out"
            >
              <option value="">{{ field.placeholder }}</option>
              <template v-if="field.options">
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </template>
            </select>
          </div>

          <!-- Date inputs -->
          <div v-for="field in dateFields" :key="field.key" class="form-group">
            <label :for="field.key" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ field.label }}
            </label>
            <input
              :id="field.key"
              type="date"
              v-model="filters[field.key]"
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition duration-150 ease-in-out"
            />
          </div>
        </div>

        <!-- Checkboxes -->
        <div class="mt-6 flex flex-wrap gap-6">
          <div v-for="field in checkboxFields" :key="field.key" class="flex items-center">
            <input
              :id="field.key"
              type="checkbox"
              v-model="filters[field.key]"
              class="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded transition duration-150 ease-in-out"
            />
            <label :for="field.key" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {{ field.label }}
            </label>
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            @click="resetFilters"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Reset
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { API_URL } from '../../services/api'
import { getAuthHeaders } from '../../services/auth'

export default {
  name: 'ShipmentsFilter',
  
  data() {
    return {
      isExpanded: true,
      loading: false,
      filters: {
        invoice_id: '',
        order: '',
        store_id: '',
        user_id: '',
        duplicates: false,
        no_store: false,
        no_quantity: false,
        created_from: '',
        created_to: '',
        updated_from: '',
        updated_to: '',
        processed: '',
        desc: '',
        product: '',
        article: '',
        sku: '',
        uzum_sku: ''
      },
      sortState: {
        sortBy: null,
        sortDirection: null
      },
      filterData: {
        stores: [],
        order_methods: [],
        users: [],
        processed: {},
        data_issues: {}
      },
      textFields: [
        { key: 'order', label: 'Buyurtma raqam', placeholder: 'Buyurtma raqamini kiriting' },
        { key: 'invoice_id', label: 'Nakladnoy raqam', placeholder: 'Nakladnoy raqamini kiriting' },
        { key: 'product', label: 'Mahsulot nomi', placeholder: 'Mahsulot nomini kiriting' },
        { key: 'article', label: 'Artikul', placeholder: 'Artikulni kiriting' },
        { key: 'sku', label: 'SKU', placeholder: 'SKU ni kiriting' },
        { key: 'uzum_sku', label: 'Uzum SKU', placeholder: 'Uzum SKU ni kiriting' },
      ],
      dateFields: [
        { key: 'created_from', label: 'Created from' },
        { key: 'created_to', label: 'Created to' },
        { key: 'updated_from', label: 'Updated from' },
        { key: 'updated_to', label: 'Updated to' }
      ]
    }
  },

  computed: {
    selectFields() {
      return [
        { 
          key: 'store_id', 
          label: 'Do\'kon',
          placeholder: 'Do\'konni tanlang',
          options: this.filterData.stores.map(store => ({
            value: store.id,
            label: store.name
          }))
        },
        { 
          key: 'order_method', 
          label: 'Order method',
          placeholder: 'Order method tanlang',
          options: this.filterData.order_methods.map(method => ({
            value: method,
            label: method
          }))
        },
        { 
          key: 'processed', 
          label: 'Holati',
          placeholder: 'Holatni tanlang',
          options: Object.entries(this.filterData.processed).map(([key, value]) => ({
            value: key,
            label: this.formatProcessedLabel(key)
          }))
        },
        { 
          key: 'user_id', 
          label: 'User',
          placeholder: 'Foydalanuvchini tanlang',
          options: this.filterData.users.map(user => ({
            value: user.id,
            label: user.name
          }))
        }
      ]
    },

    checkboxFields() {
      return Object.values(this.filterData.data_issues).map(issue => ({
        key: issue.value,
        label: issue.label,
        description: issue.description
      }))
    }
  },

  watch: {
    filters: {
      deep: true,
      handler(newVal, oldVal) {
        // Remove auto-filtering on change
        // this.applyFilters()
      }
    }
  },

  methods: {
    toggleExpanded() {
      this.isExpanded = !this.isExpanded
    },

    formatProcessedLabel(key) {
      const statusMap = {
        'sold': 'Sotilgan',
        'to_sold': 'Sotilgan',
        'returned': 'Qaytarilgan',
        'to_returned': 'Qaytarilgan',
        'brak': 'Brak',
        'to_brak': 'Brak',
        'is_null': 'Yangi'
      }
      return statusMap[key] || key
    },

    resetFilters() {
      // Reset all filters to their default values
      this.filters = {
        invoice_id: '',
        order: '',
        store_id: '',
        user_id: '',
        duplicates: false,
        no_store: false,
        no_quantity: false,
        created_from: '',
        created_to: '',
        updated_from: '',
        updated_to: '',
        processed: '',
        desc: '',
        product: '',
        article: '',
        sku: '',
        uzum_sku: ''
      }
      
      // Emit the filter event with reset filters
      this.$emit('filter', {})
    },

    applyFilters() {
      // Create a new object for API filters
      const apiFilters = {
        ...this.sortState  // Include current sort state in filters
      }

      // Text fields
      if (this.filters.order) apiFilters.order = this.filters.order
      if (this.filters.invoice_id) apiFilters.invoice_id = this.filters.invoice_id
      if (this.filters.product) apiFilters.product = this.filters.product
      if (this.filters.article) apiFilters.article = this.filters.article
      if (this.filters.sku) apiFilters.sku = this.filters.sku
      if (this.filters.uzum_sku) apiFilters.uzum_sku = this.filters.uzum_sku
      if (this.filters.desc) apiFilters.desc = this.filters.desc

      // Select fields
      if (this.filters.store_id) apiFilters.store_id = this.filters.store_id
      if (this.filters.order_method) apiFilters.order_method = this.filters.order_method
      if (this.filters.processed) apiFilters.processed = this.filters.processed
      if (this.filters.user_id) apiFilters.user_id = this.filters.user_id

      // Data issues - only add if true
      if (this.filters.duplicates) apiFilters.data_issues = 'duplicates'
      else if (this.filters.no_store) apiFilters.data_issues = 'no_store'
      else if (this.filters.no_quantity) apiFilters.data_issues = 'no_quantity'

      // Date ranges
      if (this.filters.created_from) apiFilters.created_from = this.filters.created_from
      if (this.filters.created_to) apiFilters.created_to = this.filters.created_to
      if (this.filters.updated_from) apiFilters.updated_from = this.filters.updated_from
      if (this.filters.updated_to) apiFilters.updated_to = this.filters.updated_to

      this.$emit('filter', apiFilters)
    },

    updateSortState(sortState) {
      this.sortState = sortState
      // Create combined filters with current filter state and new sort state
      const combinedFilters = {
        ...this.sortState,
        ...Object.entries(this.filters)
          .filter(([_, value]) => value !== '' && value !== null && value !== false)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
      }
      this.$emit('filter', combinedFilters)
    },

    async fetchFilterData() {
      try {
        const headers = await getAuthHeaders()
        const response = await axios.get(`${API_URL}/shipments/send/filters`, { headers })
        if (response.data.success) {
          this.filterData = response.data.data
        }
      } catch (error) {
        console.error('Error fetching filter data:', error)
      }
    }
  },

  mounted() {
    this.fetchFilterData()
  }
}
</script>

<style scoped>
.shipments-filter {
  background-color: #fff;
  background-color: var(--tw-bg-white);
  color: var(--tw-text-gray-900);
  color: #000;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.dark .shipments-filter {
  background-color: #2d2d2d;
  background-color: var(--tw-bg-gray-800);
  color: var(--tw-text-gray-100);
  color: #fff;
}

/* Custom styles for date input in dark mode */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.8);
}

.dark input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

/* Add styles for dark mode and transitions */
.shipments-filter,
.shipments-filter .form-group,
.shipments-filter .form-group label,
.shipments-filter .form-group input,
.shipments-filter .form-group select,
.shipments-filter .form-group input[type="checkbox"],
.shipments-filter .form-group input[type="date"],
.shipments-filter .form-group textarea,
.shipments-filter .form-group button {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.shipments-filter .form-group label {
  color: var(--tw-text-gray-700);
}

.dark .shipments-filter .form-group label {
  color: var(--tw-text-gray-300);
}
</style>
