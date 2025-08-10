<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../../stores/auth'
import Button from '../../common/Button.vue'
import ImageUpload from './ImageUpload.vue'
import NumberInput from '../../common/NumberInput.vue'
import ProductDetailsCard from '../ProductDetailsCard.vue'
import { fetchCategories, fetchStores } from '../../../services/referenceData'

const router = useRouter()
const props = defineProps({
  // categories: {
  //   type: Array,
  //   required: true
  // },
  // stores: {
  //   type: Array,
  //   required: true
  // }
})

const emit = defineEmits(['close', 'product-added'])

const auth = useAuth()
const loading = ref(false)
const error = ref('')
const submitting = ref(false)
const categories = ref([])
const stores = ref([])
const loadingReference = ref(true)
const showProductDetails = ref(false)
const createdProductId = ref(null)

// Load reference data
onMounted(async () => {
  try {
    const [categoriesData, storesData] = await Promise.all([
      fetchCategories(),
      fetchStores()
    ])
    categories.value = categoriesData
    stores.value = storesData
  } catch (err) {
    console.error('Error loading reference data:', err)
    error.value = 'Failed to load form data. Please try again.'
  } finally {
    loadingReference.value = false
  }
})

const form = ref({
  name: '',
  category_id: '',
  store_id: '',
  buy_price: '',
  sell_price: '',
  IKPU: '',
  currency: 'UZS',
  image: null,
  weight: '',
  ean13: '',
  package_code: ''
})

const validateForm = () => {
  if (!form.value.name) return 'Mahsulot nomi majburiy'
  if (!form.value.category_id) return 'Kategoriya majburiy'
  if (!form.value.store_id) return `Do'kon nomi majburiy`
  if (!form.value.buy_price) return 'Xarid narxi majburiy'
  if (!form.value.sell_price) return 'Sotuv narxi majburiy'
  if (!form.value.IKPU) return 'IKPU majburiy'
  if (!form.value.currency) return 'Valyuta majburiy'
  return null
}

const handleImageSelected = (file) => {
  form.value.image = file
}

const handleSubmit = async (viewDetails = false) => {
  if (submitting.value) return // Prevent double submission
  
  error.value = ''
  const validationError = validateForm()
  if (validationError) {
    error.value = validationError
    return
  }

  submitting.value = true // Start submission
  loading.value = true

  try {
    const formData = new FormData()
    
    // Add required fields
    formData.append('name', form.value.name)
    formData.append('category_id', form.value.category_id)
    formData.append('store_id', form.value.store_id)
    formData.append('buy_price', form.value.buy_price)
    formData.append('sell_price', form.value.sell_price)
    formData.append('IKPU', form.value.IKPU)
    formData.append('currency', form.value.currency)
    
    // Add optional fields only if they have values
    if (form.value.image) {
      formData.append('image', form.value.image)
    }
    if (form.value.weight) {
      formData.append('weight', form.value.weight)
    }
    if (form.value.ean13) {
      formData.append('ean13', form.value.ean13)
    }
    if (form.value.package_code) {
      formData.append('package_code', form.value.package_code)
    }

    const response = await fetch('https://api.mgoods.uz/api/products/product/create', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${auth.token.value}`
      }
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add product')
    }

    emit('product-added', data.data)
    
    if (viewDetails) {
      router.push({ name: 'product-details', params: { id: data.data.id } })
    } else {
      emit('close')
    }
  } catch (err) {
    error.value = err.message || 'Failed to add product'
    console.error('Error adding product:', err)
  } finally {
    submitting.value = false // End submission
    loading.value = false
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <template v-if="loading">
      <div class="flex items-center justify-center h-full flex-col">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p class="mt-4 text-gray-700 dark:text-gray-300">Mahsulot yaratilmoqda...</p>
      </div>
    </template>
    <template v-else-if="loadingReference">
      <div class="flex items-center justify-center h-full">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    </template>
    <template v-else-if="showProductDetails">
      <ProductDetailsCard :product-id="createdProductId" />
      <div class="flex justify-end pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
        <Button @click="$emit('close')" variant="secondary" class="mr-3">Yopish</Button>
      </div>
    </template>
    <template v-else>
      <form class="h-full flex flex-col" @submit.prevent>
        <!-- Form Content -->
        <div class="flex-1 space-y-6">
          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
            {{ error }}
          </div>

          <!-- Basic Info -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mahsulot nomi</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="Mahsulot nomi"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategoriya</label>
              <select
                v-model="form.category_id"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Kategoriya tanlang</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Do'kon</label>
              <select
                v-model="form.store_id"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Do'kon tanlang</option>
                <option v-for="store in stores" :key="store.id" :value="store.id">
                  {{ store.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Pricing -->
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Xarid narxi</label>
                <NumberInput
                  v-model="form.buy_price"
                  placeholder="Xarid narxini kiriting"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sotuv narxi</label>
                <NumberInput
                  v-model="form.sell_price"
                  placeholder="Sotuv narxini kiriting"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IKPU</label>
                <input
                  v-model="form.IKPU"
                  type="text"
                  maxlength="17"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  placeholder="IKPU kod (17 ta belgi)"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qo'shimcha kod (IKPU)</label>
                <input
                  v-model="form.package_code"
                  type="text"
                  maxlength="7"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Qo'shimcha kod (7 ta belgi)"
                />
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rasm</label>
              <ImageUpload @image-selected="handleImageSelected" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valyuta</label>
              <select
                v-model="form.currency"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="UZS">UZS</option>
                <option value="USD">USD</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Og'irligi (gramda)</label>
              <input
                v-model="form.weight"
                type="text"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="Og'irlikni kiriting"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">EAN13</label>
              <input
                v-model="form.ean13"
                type="text"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="EAN13 kodni kiriting"
              />
            </div>
          </div>
        </div>

        <!-- Submit Buttons - Fixed at Bottom -->
        <div class="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
          <Button 
            type="button" 
            variant="secondary" 
            :loading="submitting"
            :disabled="submitting"
            @click="handleSubmit(false)"
          >
            <template v-if="!submitting">Saqlash va yopish</template>
            <template v-else>Saqlanmoqda...</template>
          </Button>
          <Button 
            type="button" 
            :loading="submitting"
            :disabled="submitting"
            @click="handleSubmit(true)"
          >
            <template v-if="!submitting">Saqlash va ko'rish</template>
            <template v-else>Saqlanmoqda...</template>
          </Button>
        </div>
      </form>
    </template>
  </div>
</template>