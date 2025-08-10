<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
    <div class="space-y-6">
      <!-- General Search -->
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ummumiy qidirish</label>
          <input
            type="text"
            v-model="localFilters.search"
            placeholder="Mahsulotlarni qidirish..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            @keydown="handleKeyDown"
          />
        </div>
      </div>

      <!-- Store Multi-Select Dropdown -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Other Filters -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Artikul</label>
          <input
            type="text"
            v-model="localFilters.article"
            placeholder="Artikul boyicha qidirish..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            @keydown="handleKeyDown"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
          <input
            type="text"
            v-model="localFilters.sku"
            placeholder="SKU boyicha qidirish..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            @keydown="handleKeyDown"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Do'konlar</label>
          <div class="relative store-dropdown">
            <div 
              class="w-full min-h-[42px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 focus-within:ring-2 focus-within:ring-indigo-500 cursor-pointer"
              @click="showStoreDropdown = true"
            >
              <div class="flex flex-wrap gap-2">
                <template v-if="selectedStores.length">
                  <div 
                    v-for="store in selectedStores" 
                    :key="store.id"
                    class="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900 text-sm"
                  >
                    <span>{{ store.name }}</span>
                    <button 
                      @click.stop="removeStore(store.id)"
                      class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                    >
                      ×
                    </button>
                  </div>
                </template>
                <div v-else class="text-gray-500 dark:text-gray-400 py-1 text-sm">
                  Do'konlarni tanlang...
                </div>
              </div>
            </div>

            <!-- Dropdown -->
            <div 
              v-if="showStoreDropdown" 
              class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg"
            >
              <div class="p-2">
                <input
                  type="text"
                  v-model="storeSearch"
                  placeholder="Do'konlarni qidirish..."
                  class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                  @click.stop
                />
              </div>
              <div class="max-h-60 overflow-y-auto">
                <div 
                  v-for="store in filteredStores" 
                  :key="store.id"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm flex items-center gap-2"
                  @click.stop="toggleStore(store)"
                >
                  <input 
                    type="checkbox" 
                    :checked="isStoreSelected(store.id)"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{{ store.name }}</span>
                </div>
                <div 
                  v-if="!filteredStores.length" 
                  class="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm"
                >
                  Do'konlar topilmadi
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yaratilgan (dan)</label>
          <input type="datetime-local" v-model="localFilters.created_at_from" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yaratilgan (gacha)</label>
          <input type="datetime-local" v-model="localFilters.created_at_to" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
        </div>
      <!-- FBS Toggle -->
      <div class="flex items-center space-x-2">
        <label class="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            v-model="localFilters.is_fbs"
            class="sr-only peer"
          >
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">FBS</span>
        </label>
      </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4">
        <Button @click="resetFilters" variant="secondary">Filterni tozalash</Button>
        <Button @click="applyFilters" variant="primary">Filterni qo'shish</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import Button from '../common/Button.vue'
const props = defineProps({
  stores: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['filter'])

const localFilters = reactive({
  sku: '',
  article: '',
  product_name: '',
  is_fbs: false,
  search: '',
  created_at_from: '',
  created_at_to: '',
  store_id: [], // for selected store IDs
})

const selectedStores = ref([])
const showStoreDropdown = ref(false)
const storeSearch = ref('')

watch(
  () => props.stores,
  (newStores) => {
    if (!selectedStores.value.length) {
      selectedStores.value = []
    }
  },
  { immediate: true }
)

const filteredStores = computed(() => {
  if (!storeSearch.value) return props.stores
  const search = storeSearch.value.toLowerCase()
  return props.stores.filter(store => store.name.toLowerCase().includes(search))
})

function isStoreSelected(id) {
  return localFilters.store_id.includes(id)
}
function toggleStore(store) {
  const index = localFilters.store_id.indexOf(store.id)
  if (index === -1) {
    localFilters.store_id.push(store.id)
    selectedStores.value.push(store)
  } else {
    localFilters.store_id.splice(index, 1)
    selectedStores.value = selectedStores.value.filter(s => s.id !== store.id)
  }
}
function removeStore(id) {
  const idx = localFilters.store_id.indexOf(id)
  if (idx !== -1) {
    localFilters.store_id.splice(idx, 1)
  }
  selectedStores.value = selectedStores.value.filter(s => s.id !== id)
}
function handleKeyDown(event) {
  if (event.key === 'Enter') {
    applyFilters()
  }
}

function formatDateTimeLocal(value) {
  if (!value) return '';
  // value is '2025-06-29T00:00' or '2025-06-29T00:00:00'
  const [date, time] = value.split('T');
  if (!date || !time) return value;
  // Ensure time is HH:mm:ss
  const timeParts = time.split(':');
  let formattedTime = time;
  if (timeParts.length === 2) {
    formattedTime = `${time}:00`;
  }
  return `${date} ${formattedTime}`;
}

function add10SecondsToDateTimeLocal(value) {
  if (!value) return '';
  // Accepts 'YYYY-MM-DDTHH:mm' or 'YYYY-MM-DDTHH:mm:ss'
  let dateObj;
  if (value.length === 16) { // 'YYYY-MM-DDTHH:mm'
    dateObj = new Date(value + ':00');
  } else if (value.length === 19) { // 'YYYY-MM-DDTHH:mm:ss'
    dateObj = new Date(value);
  } else {
    return value;
  }
  if (isNaN(dateObj)) return value;
  dateObj.setSeconds(dateObj.getSeconds() + 10);
  // Format back to 'YYYY-MM-DD HH:mm:ss'
  const pad = n => n.toString().padStart(2, '0');
  const yyyy = dateObj.getFullYear();
  const mm = pad(dateObj.getMonth() + 1);
  const dd = pad(dateObj.getDate());
  const hh = pad(dateObj.getHours());
  const min = pad(dateObj.getMinutes());
  const ss = pad(dateObj.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

function resetFilters() {
  Object.assign(localFilters, {
    search: '',
    article: '',
    sku: '',
    product_name: '',
    is_fbs: false,
    created_at_from: '',
    created_at_to: '',
    report_date_from: '',
    report_date_to: '',
    store_id: [],
  })
  selectedStores.value = []
  storeSearch.value = ''
  // Only include store_ids if there are selected stores
  const payload = { ...localFilters }
  if (localFilters.store_id && localFilters.store_id.length > 0) {
    payload.store_ids = localFilters.store_id
  }
  emit('filter', payload)
}

function applyFilters() {
  // Only include non-empty fields in the payload
  const payload = {};
  Object.entries(localFilters).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length === 0) return;
    if (typeof value === 'string' && !value.trim()) return;
    payload[key] = value;
  });
  // Format dates if present
  if (localFilters.created_at_from) {
    payload.created_at_from = formatDateTimeLocal(localFilters.created_at_from);
  }
  if (localFilters.created_at_to) {
    payload.created_at_to = add10SecondsToDateTimeLocal(localFilters.created_at_to);
  }
  emit('filter', payload);
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
function handleClickOutside(event) {
  const dropdown = document.querySelector('.store-dropdown')
  if (dropdown && !dropdown.contains(event.target)) {
    showStoreDropdown.value = false
  }
}
</script>