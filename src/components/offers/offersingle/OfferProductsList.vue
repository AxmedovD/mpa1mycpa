<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Products</h3>
    </div>
    
    <!-- Product Edit Modal -->
    <ProductEditModal 
      :is-visible="showEditModal" 
      :product="selectedProduct"
      :offer-id="offerId"
      @close="showEditModal = false"
      @updated="handleProductUpdated"
    />
    
    <!-- Variant Edit Modal -->
    <VariantEditModal
      :is-visible="showVariantModal"
      :variant="selectedVariant"
      :offer-id="offerId"
      @close="showVariantModal = false"
      @updated="handleVariantUpdated"
    />
    
    <div class="divide-y divide-gray-200 dark:divide-gray-700">
      <div v-if="products.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
        No products found for this offer
      </div>
      
      <div v-for="product in products" :key="product.id" class="p-6">
        <!-- Product header -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ product.product?.name || 'Unnamed Product' }}</h4>
            <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span class="mr-4">SKU: {{ product.product?.sku || 'N/A' }}</span>
              <span>Article: {{ product.article || product.product?.article || 'N/A' }}</span>
            </div>
            <div class="mt-2 flex flex-wrap gap-4">
              <div class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">Buy Price:</span>
                <span class="ml-1 font-medium text-gray-900 dark:text-white">{{ formatCurrency(product.product?.buy_price) }}</span>
              </div>
              <div class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">Sell Price:</span>
                <span class="ml-1 font-medium text-gray-900 dark:text-white">{{ formatCurrency(product.product?.sell_price) }}</span>
              </div>
              <div class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">Last Updated:</span>
                <span class="ml-1 font-medium text-gray-900 dark:text-white">{{ formatDate(product.product?.updated_at) }}</span>
              </div>
            </div>
          </div>
          <button 
            @click="editProduct(product.id)"
            class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
          >
            <span class="mr-1">Edit Product</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
        
        <!-- Variants section (always visible) -->
        <div class="mt-4">
          <div v-if="!product.product?.variants || product.product.variants.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
            No variants available for this product
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="variant in product.product.variants" 
              :key="variant.id" 
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start space-x-4">
                <img 
                  :src="variant.image" 
                  :alt="variant.name"
                  class="w-20 h-20 object-cover rounded-md flex-shrink-0"
                  @error="handleImageError"
                />
                
                <div class="flex-1 ml-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h5 class="font-medium text-gray-900 dark:text-white">{{ variant.name }}</h5>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">SKU: {{ variant.sku }}</p>
                    </div>
                    <button 
                      @click="editVariant(product.id, variant.id)" 
                      class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                  
                  <div class="mt-2 space-y-1">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500 dark:text-gray-400">Buy Price:</span>
                      <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(variant.buy_price) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500 dark:text-gray-400">Sell Price:</span>
                      <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(variant.sell_price) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500 dark:text-gray-400">Availability:</span>
                      <span 
                        class="font-medium"
                        :class="{
                          'text-green-600 dark:text-green-400': variant.is_available === 'stock',
                          'text-red-600 dark:text-red-400': variant.is_available === 'out_of_stock',
                          'text-yellow-600 dark:text-yellow-400': variant.is_available === 'limited'
                        }"
                      >
                        {{ formatAvailability(variant.is_available) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductEditModal from './ProductEditModal.vue'
import VariantEditModal from './VariantEditModal.vue'

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  },
  offerId: {
    type: [Number, String],
    required: true
  }
})

// State for product edit modal
const showEditModal = ref(false)
const selectedProduct = ref(null)

// State for variant edit modal
const showVariantModal = ref(false)
const selectedVariant = ref(null)

// Open edit modal for a product
const editProduct = (productId) => {
  // Find the product in the products array
  const foundProduct = props.products.find(p => p.id === productId)?.product
  if (foundProduct) {
    selectedProduct.value = foundProduct
    showEditModal.value = true
  }
}

// Open edit modal for a variant
const editVariant = (productId, variantId) => {
  // Find the product in the products array
  const foundProduct = props.products.find(p => p.id === productId)?.product
  if (foundProduct && foundProduct.variants) {
    const foundVariant = foundProduct.variants.find(v => v.id === variantId)
    if (foundVariant) {
      selectedVariant.value = foundVariant
      showVariantModal.value = true
    }
  }
}

// Handle product update
const handleProductUpdated = (updatedProduct) => {
  // Emit an event to refresh products or update locally
  // For now, we'll just show a success message
  console.log('Product updated:', updatedProduct)
  
  // Refresh the page to show updated data
  // In a real app, you might want to update the local state instead
  window.location.reload()
}

// Handle variant update
const handleVariantUpdated = (updatedVariant) => {
  // Emit an event to refresh products or update locally
  console.log('Variant updated:', updatedVariant)
  
  // Refresh the page to show updated data
  window.location.reload()
}

// Format currency
const formatCurrency = (value) => {
  if (!value) return '0.00'
  
  const numValue = parseFloat(value)
  return new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue)
}

// Format availability status
const formatAvailability = (status) => {
  if (!status) return 'Unknown'
  
  switch (status.toLowerCase()) {
    case 'stock':
      return 'In Stock'
    case 'out_of_stock':
      return 'Out of Stock'
    case 'limited':
      return 'Limited Stock'
    default:
      return status
  }
}

// Handle image loading error
const handleImageError = (e) => {
  e.target.src = '/img/no-image.png' // Fallback image
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('uz-UZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>
