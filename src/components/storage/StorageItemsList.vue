<template>
  <div class="space-y-2">
    <h4 class="font-medium text-gray-700 dark:text-gray-300">Mahsulotlar</h4>
    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div class="grid grid-cols-5 gap-5 mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        <div>Mahsulot</div>
        <div>SKU</div>
        <div>Miqdori</div>
        <div>Narxi</div>
        <div>Jami narxi</div>
      </div>
      <div class="space-y-2">
        <div 
          v-for="item in items" 
          :key="item.id"
          class="grid grid-cols-5 gap-5 text-sm text-gray-900 dark:text-gray-100"
        >
          <div>{{ item.product_name }}</div>
          <div>{{ item.sku }}</div>
          <div>{{ formatQuantity(item.quantity) }}</div>
          <div>{{ formatCurrency(item.real_buy_price) }}</div>
          <div>{{ formatCurrency(item.real_buy_price * item.quantity) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatQuantity, formatCurrency } from '../../utils/formatters'

defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>