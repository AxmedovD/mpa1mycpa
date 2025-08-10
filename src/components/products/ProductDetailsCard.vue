<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-md">
      {{ error }}
    </div>

    <!-- Product Details -->
    <div v-else-if="product" class="space-y-6">
      <!-- Basic Info -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Asosiy ma'lumotlar </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Mahsulot nomi</label>
            <p class="mt-1 text-gray-900 dark:text-white">{{ product.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Kategoriya</label>
            <p class="mt-1 text-gray-900 dark:text-white">{{ product.category?.name || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Do'kon</label>
            <p class="mt-1 text-gray-900 dark:text-white">{{ product.store?.name || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">IKPU</label>
            <p class="mt-1 text-gray-900 dark:text-white">{{ product.IKPU || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">SKU</label>
            <p class="mt-1 text-gray-900 dark:text-white">{{ product.uzum_sku_title || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Xarid narxi</label>
            <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ Number(product.buy_price).toLocaleString() }} {{ product.currency }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Sotuv narxi</label>
            <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ Number(product.sell_price).toLocaleString() }} {{ product.currency }}
            </p>
          </div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Qo'shimcha ma'lumotlar</h3>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">O'lchov boshlig'i</label>
            <p class="mt-1 text-gray-900 dark:text-white">{{ product.weight || 'N/A' }}</p>
          </div>
          <div v-if="product.image">
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Rasm</label>
            <img :src="product.image" :alt="product.name" class="mt-2 max-w-xs rounded-lg">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchProductById } from '../../services/products'

const route = useRoute()
const product = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    product.value = await fetchProductById(route.params.id)
  } catch (err) {
    console.error('Error loading product:', err)
    error.value = 'Failed to load product details'
  } finally {
    loading.value = false
  }
})
</script>
