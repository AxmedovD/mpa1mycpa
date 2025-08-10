<script setup>
import { ref, computed } from 'vue'
import DateFilter from './filters/DateFilter.vue'
import MultiSelect from '../common/MultiSelect.vue'
import Button from '../common/Button.vue'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      bankAccounts: [],
      kontragents: [],
      reasons: []
    })
  }
})

const emit = defineEmits(['filter'])

const initialFilters = {
  search: '',
  types: [],
  bank_account_ids: [],
  kontragent_ids: [],
  reason_ids: [],
  created_at: {
    from: '',
    to: ''
  },
  updated_at: {
    from: '',
    to: ''
  }
}

const currentFilters = ref({ ...initialFilters })

// Transform data for MultiSelect components
const bankAccountOptions = computed(() => {
  return props.filters.bankAccounts.map(account => ({
    id: account.id,
    name: `${account.bank_name} (${account.currency})`
  }))
})

const kontragentOptions = computed(() => {
  return props.filters.kontragents.map(kontragent => ({
    id: kontragent.id,
    name: kontragent.name
  }))
})

const reasonOptions = computed(() => {
  return props.filters.reasons.map(reason => ({
    id: reason.id,
    name: reason.name
  }))
})

const handleFilterChange = (key, value) => {
  if (key.includes('.')) {
    const [parent, child] = key.split('.')
    currentFilters.value[parent][child] = value
  } else {
    currentFilters.value[key] = value
  }
}

const applyFilters = () => {
  // Clean filters before sending
  const cleanFilters = {}
  
  Object.entries(currentFilters.value).forEach(([key, value]) => {
    // Handle arrays (types, bank_account_ids, etc.)
    if (Array.isArray(value) && value.length > 0) {
      cleanFilters[key] = value
    }
    // Handle search
    else if (key === 'search' && value) {
      cleanFilters[key] = value
    }
    // Handle date objects
    else if (typeof value === 'object' && value !== null) {
      const cleanDates = {}
      if (value.from) cleanDates.from = value.from
      if (value.to) cleanDates.to = value.to
      if (Object.keys(cleanDates).length > 0) {
        cleanFilters[key] = cleanDates
      }
    }
  })

  emit('filter', cleanFilters)
}

const resetFilters = () => {
  currentFilters.value = { ...initialFilters }
  // Emit empty object for reset to only send page and per_page
  emit('filter', {})
}
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MultiSelect
          v-model="currentFilters.bank_account_ids"
          :options="bankAccountOptions"
          label="Hisoblar"
          searchable
          multiple
          @update:modelValue="value => handleFilterChange('bank_account_ids', value)"
        />
        
        <MultiSelect
          v-model="currentFilters.kontragent_ids"
          :options="kontragentOptions"
          label="Kontragentlar"
          searchable
          multiple
          @update:modelValue="value => handleFilterChange('kontragent_ids', value)"
        />
        
        <MultiSelect
          v-model="currentFilters.reason_ids"
          :options="reasonOptions"
          label="O'tkazma sababi"
          searchable
          multiple
          @update:modelValue="value => handleFilterChange('reason_ids', value)"
        />
      </div>
      
      <div class="flex items-center space-x-4 mb-4">
        <!-- Search input -->
        <div class="flex-1">
          <input
            type="text"
            v-model="currentFilters.search"
            @input="value => handleFilterChange('search', value.target.value)"
            placeholder="Izoh bo'yicha qidiruv..."
            class="w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-800 dark:focus:ring-blue-500 sm:text-sm sm:leading-6"
          >
        </div>

        <!-- Type checkboxes -->
        <label class="inline-flex items-center">
          <input
            type="checkbox"
            v-model="currentFilters.types"
            value="in"
            class="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
          >
          <span class="ml-2 text-gray-700 dark:text-gray-300">Kirim</span>
        </label>

        <label class="inline-flex items-center">
          <input
            type="checkbox"
            v-model="currentFilters.types"
            value="out"
            class="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
          >
          <span class="ml-2 text-gray-700 dark:text-gray-300">Chiqim</span>
        </label>

        <label class="inline-flex items-center">
          <input
            type="checkbox"
            v-model="currentFilters.types"
            value="transfer"
            class="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
          >
          <span class="ml-2 text-gray-700 dark:text-gray-300">Transfer</span>
        </label>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateFilter
          label="Yaratilgan sana boyicha"
          :from-date="currentFilters.created_at.from"
          :to-date="currentFilters.created_at.to"
          @update:from-date="value => handleFilterChange('created_at.from', value)"
          @update:to-date="value => handleFilterChange('created_at.to', value)"
        />

        <DateFilter
          label="Oxirgi o'zgartirilgan sana boyicha"
          :from-date="currentFilters.updated_at.from"
          :to-date="currentFilters.updated_at.to"
          @update:from-date="value => handleFilterChange('updated_at.from', value)"
          @update:to-date="value => handleFilterChange('updated_at.to', value)"
        />
      </div>

      <!-- Filter action buttons -->
      <div class="flex justify-end space-x-4 mt-4">
        <Button variant="secondary" @click="resetFilters">Filterni tozalash</Button>
        <Button @click="applyFilters">Filterni qo'shish</Button>
      </div>
    </div>
  </div>
</template>