<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import SearchFilter from './filters/SearchFilter.vue'
import SelectFilter from './filters/SelectFilter.vue'
import DateFilter from './filters/DateFilter.vue'
import CheckboxFilter from './filters/CheckboxFilter.vue'
import Button from '../common/Button.vue'
import { useStorageFilterData } from '../../composables/useStorageFilterData'
import { fetchUserData } from '../../api/user'

const emit = defineEmits(['filter'])

const {
  users,
  stores,
  kontragents,
  types,
  loading,
  error
} = useStorageFilterData()

const currentUser = ref(null)
const isSuperAdmin = computed(() => currentUser.value?.type === 'superadmin')

// Load user data
const loadUserData = async () => {
  try {
    const userData = await fetchUserData()
    currentUser.value = userData
  } catch (err) {
    console.error('Error loading user data:', err)
  }
}

onMounted(loadUserData)

const initialFilters = {
  product_name: '',
  sku: '',
  user_id: '',
  store_id: '',
  kontragent_id: '',
  type: '',
  k_debt_id: undefined,
  k_transaction_id: undefined,
  created_at_from: '',
  created_at_to: '',
  updated_at_from: '',
  updated_at_to: ''
}

const filters = ref({ ...initialFilters })

// Watch for user changes and update filter for storekeeper
watch(() => currentUser.value, (newUser) => {
  if (!isSuperAdmin.value && newUser?.id) {
    filters.value.user_id = newUser.id.toString()
    emit('filter', { ...filters.value })
  }
}, { immediate: true })

const handleFilterChange = (key, value) => {
  filters.value[key] = value
}

const handleTypeChange = (value) => {
  filters.value.type = filters.value.type === value ? '' : value
}

const handleCheckboxChange = (key, value) => {
  filters.value[key] = value ? 'not_null' : undefined
}

const applyFilters = () => {
  const apiFilters = {
    product_name: filters.value.product_name || undefined,
    sku: filters.value.sku || undefined,
    user_id: filters.value.user_id || undefined,
    store_id: filters.value.store_id || undefined,
    kontragent_id: filters.value.kontragent_id || undefined,
    type: filters.value.type || undefined,
    k_debt_id: filters.value.k_debt_id,
    k_transaction_id: filters.value.k_transaction_id,
    created_at_from: filters.value.created_at_from || undefined,
    created_at_to: filters.value.created_at_to || undefined,
    updated_at_from: filters.value.updated_at_from || undefined,
    updated_at_to: filters.value.updated_at_to || undefined
  }

  // Remove undefined values
  Object.keys(apiFilters).forEach(key => 
    apiFilters[key] === undefined && delete apiFilters[key]
  )

  // If not superadmin, force user_id filter
  if (!isSuperAdmin.value && currentUser.value?.id) {
    apiFilters.user_id = currentUser.value.id.toString()
  }

  emit('filter', apiFilters)
}

const resetFilters = () => {
  filters.value = { ...initialFilters }
  // If storekeeper, maintain the user_id filter
  if (!isSuperAdmin.value && currentUser.value?.id) {
    filters.value.user_id = currentUser.value.id.toString()
  }
  emit('filter', !isSuperAdmin.value && currentUser.value?.id ? { user_id: currentUser.value.id } : {})
}

// Computed property to determine if user filter should be shown
const showUserFilter = computed(() => isSuperAdmin.value)
</script>

<template>
  <div v-if="loading" class="p-4 text-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
  </div>

  <div v-else-if="error" class="p-4 text-red-600 dark:text-red-400">
    {{ error }}
  </div>

  <div v-else class="space-y-6">
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mahsulot nomi</label>
          <input
            type="text"
            v-model="filters.product_name"
            placeholder="Mahsulot nomi..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
          <input
            type="text"
            v-model="filters.sku"
            placeholder="Mahsulotning SKU..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectFilter
          v-if="showUserFilter"
          label="User"
          :options="users"
          v-model="filters.user_id"
        />
        
        <SelectFilter
          label="Store"
          :options="stores"
          v-model="filters.store_id"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectFilter
          label="Kontragent"
          :options="kontragents"
          v-model="filters.kontragent_id"
        />

        <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div class="flex flex-wrap items-center gap-x-4">
            <label v-for="type in types" :key="type.value" class="inline-flex flex-col items-start">
              <span class="text-sm text-gray-700 dark:text-gray-300 mb-1">{{ type.label }}</span>
              <input
                type="radio"
                :value="type.value"
                :checked="filters.type === type.value"
                @click="handleTypeChange(type.value)"
                class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div class="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

          <div class="flex flex-wrap items-center gap-x-4">
            <CheckboxFilter
              label="Qarz"
              v-model="filters.k_debt_id"
              @update:modelValue="value => handleCheckboxChange('k_debt_id', value)"
            />
            <CheckboxFilter
              label="Naqd"
              v-model="filters.k_transaction_id"
              @update:modelValue="value => handleCheckboxChange('k_transaction_id', value)"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateFilter
          label="Yaratilgan sana boyicha"
          :from-date="filters.created_at_from"
          :to-date="filters.created_at_to"
          @update:fromDate="value => handleFilterChange('created_at_from', value)"
          @update:toDate="value => handleFilterChange('created_at_to', value)"
        />
        
        <DateFilter
          label="Oxirgi o'zgartirilgan sana boyicha"
          :from-date="filters.updated_at_from"
          :to-date="filters.updated_at_to"
          @update:fromDate="value => handleFilterChange('updated_at_from', value)"
          @update:toDate="value => handleFilterChange('updated_at_to', value)"
        />
      </div>
    </div>

    <div class="flex justify-end space-x-4">
      <Button variant="secondary" @click="resetFilters">Filterni tozalash</Button>
      <Button @click="applyFilters">Filterni qo'shish</Button>
    </div>
  </div>
</template>