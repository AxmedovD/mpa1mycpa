<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th class="w-10 px-6 py-3"></th>
          <th 
            v-for="header in headers" 
            :key="header.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-if="items.length === 0">
          <td 
            :colspan="headers.length + 1" 
            class="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
          >
            Ma'lumotlar topilmadi
          </td>
        </tr>
        <template v-for="item in items" :key="item.id">
          <tr 
            class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            @click="toggleItems(item.id)"
          >
            <td class="px-6 py-4 w-10" @click.stop>
              <button 
                @click="toggleItems(item.id)"
                class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
              >
                <svg 
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-90': expandedState.get(item.id) }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ item.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ item.created_at }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ item.user_name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ item.store_name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ item.kontragent_name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <StorageTypeLabel :type="item.type" />
                <PaymentTypeTag 
                  :k-debt-id="item.k_debt_id"
                  :k-transaction-id="item.k_transaction_id"
                  :type="item.type"
                />
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ formatAmount(item.k_amount) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
              {{ item.description }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
              {{ item.updated_at }}
            </td>
          </tr>
          <tr 
            v-if="expandedState.get(item.id)"
            class="bg-gray-50 dark:bg-gray-700"
          >
            <td :colspan="headers.length + 1" class="px-6 py-4">
              <!-- Expanded content -->
              <div class="text-sm text-gray-900 dark:text-white">
                <StorageItemsList :items="item.items || []" />
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StorageItemsList from './StorageItemsList.vue'
import StorageTypeLabel from './StorageTypeLabel.vue'
import PaymentTypeTag from './PaymentTypeTag.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const expandedItems = ref(new Set())
const headers = [
  { key: 'id', label: 'ID' },
  { key: 'created_at', label: 'Yaratilgan sana' },
  { key: 'user_name', label: 'Foydalanuvchi' },
  { key: 'store_name', label: 'Do\'kon' },
  { key: 'kontragent_name', label: 'Kontragent' },
  { key: 'type', label: 'Type' },
  { key: 'k_amount', label: 'Summa' },
  { key: 'description', label: 'Izoh' },
  { key: 'updated_at', label: 'O\'zgartirilgan sana' }
]

// Memoize expanded state calculations
const expandedState = computed(() => {
  return new Map(props.items.map(item => [
    item.id,
    expandedItems.value.has(item.id)
  ]))
})

const toggleItems = (itemId) => {
  const newSet = new Set(expandedItems.value)
  if (newSet.has(itemId)) {
    newSet.delete(itemId)
  } else {
    newSet.add(itemId)
  }
  expandedItems.value = newSet
}

// Reset expanded items when items change significantly
watch(
  () => props.items.length,
  () => {
    expandedItems.value = new Set()
  }
)

const formatAmount = (amount) => {
  return Number(amount)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};


</script>