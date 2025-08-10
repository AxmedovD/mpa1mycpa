
<script setup>
import { ref, onMounted, computed } from 'vue'
import Button from '../../common/Button.vue'
import ImageUpload from './ImageUpload.vue'
import NumberInput from '../../common/NumberInput.vue'
import { fetchProductOptions, fetchOptionValues, createProductVariant } from '../../../services/variants'

const props = defineProps({
  productId: {
    type: [Number, String],
    required: true
  },
  productName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'variant-added', 'variant-add-result'])

const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const productOptions = ref([])
const optionValues = ref([])
const selectedOptionId = ref('')
const selectedOptionValue = ref(null)

// Additional option logic
const showAdditionalOptions = ref(false)
const additionalOptionId = ref('')
const additionalOptionValues = ref([])
const selectedAdditionalOptionValues = ref([]) // array of selected values
const showAdditionalDropdown = ref(false)
const additionalSearch = ref('')

function closeAdditionalDropdown() {
  showAdditionalDropdown.value = false
  additionalSearch.value = ''
}

const multiMainDropdownOpen = ref(false)
const mainSearch = ref('')

// Helper to close dropdown and reset search
function closeMainDropdown() {
  multiMainDropdownOpen.value = false
  mainSearch.value = ''
}

import { watch } from 'vue'

// For single-select binding
const singleMainValue = computed({
  get() {
    return form.value.product_option_value_ids[0] || ''
  },
  set(val) {
    form.value.product_option_value_ids = val ? [val] : []
  }
})

// Watch for mode changes and reset appropriately
watch(showAdditionalOptions, (val) => {
  if (val) {
    // Switching to single-select: keep only first selected value
    if (form.value.product_option_value_ids.length > 1) {
      form.value.product_option_value_ids = [form.value.product_option_value_ids[0]]
    }
    multiMainDropdownOpen.value = false
  }
})

const handleAdditionalOptionChange = async () => {
  if (additionalOptionId.value) {
    loading.value = true
    additionalOptionValues.value = await fetchOptionValues(additionalOptionId.value);
    loading.value = false;
    selectedAdditionalOptionValues.value = [];
    additionalSearch.value = '';
  } else {
    additionalOptionValues.value = [];
    selectedAdditionalOptionValues.value = [];
    additionalSearch.value = '';
  }
};

const filteredAdditionalOptionValues = computed(() => {
  if (!additionalSearch.value) return additionalOptionValues.value
  return additionalOptionValues.value.filter(val => val.value.toLowerCase().includes(additionalSearch.value.toLowerCase()))
})

const form = ref({
  buy_price: '',
  sell_price: '',
  product_option_value_ids: [], // for multi-select
  image: null,
  ean13: ''
})

// Computed property for variant name (supports two values)
const variantName = computed(() => {
  if (!form.value.product_option_value_ids || form.value.product_option_value_ids.length === 0) return ''
  const mainNames = form.value.product_option_value_ids
    .map(id => optionValues.value.find(v => v.id === id)?.value || id)
    .join(', ')
  if (showAdditionalOptions.value && selectedAdditionalOptionValues.value.length > 0) {
    const names = selectedAdditionalOptionValues.value
      .map(val => additionalOptionValues.value.find(v => v.id === val)?.value || val)
      .join(', ');
    return `${props.productName} (${mainNames} - ${names})`
  }
  return `${props.productName} (${mainNames})`
})

onMounted(async () => {
  try {
    loading.value = true
    productOptions.value = await fetchProductOptions()
  } catch (err) {
    error.value = err.message || 'Failed to load product options'
  } finally {
    loading.value = false
  }
})

const handleOptionChange = async () => {
  if (!selectedOptionId.value) {
    optionValues.value = []
    form.value.product_option_value_ids = []
    selectedOptionValue.value = null
    // Reset additional selection
    showAdditionalOptions.value = false
    additionalOptionId.value = ''
    additionalOptionValues.value = []
    selectedAdditionalOptionValue.value = null
    return
  }

  try {
    loading.value = true
    optionValues.value = await fetchOptionValues(selectedOptionId.value)
  } catch (err) {
    error.value = err.message || 'Failed to load option values'
    optionValues.value = []
  } finally {
    loading.value = false
  }

  // Reset additional selection if main option changes
  showAdditionalOptions.value = false
  additionalOptionId.value = ''
  additionalOptionValues.value = []
  selectedAdditionalOptionValue.value = null
}

const handleOptionValueChange = () => {
  // Reset additional selection if main value changes
  additionalOptionId.value = ''
  additionalOptionValues.value = []
  selectedAdditionalOptionValues.value = []
}

const handleImageSelected = (file) => {
  form.value.image = file
}

const validateForm = () => {
  if (!showAdditionalOptions.value && (!form.value.product_option_value_ids || form.value.product_option_value_ids.length === 0)) {
    return '1-variant qiymati tanlanmagan!';
  }
  if (showAdditionalOptions.value && (!form.value.product_option_value_ids || form.value.product_option_value_ids.length !== 1)) {
    return 'Qoida: Qoʻshimcha variant tanlanganda, faqat 1 ta asosiy variant qiymati tanlanishi kerak!';
  }
  if (showAdditionalOptions.value && (!additionalOptionId.value || selectedAdditionalOptionValues.value.length === 0)) {
    return 'Qoʻshimcha variant va qiymat tanlanmagan!';
  }
  return null;
}

const handleSubmit = async () => {
  if (submitting.value) return

  error.value = ''
  const validationError = validateForm()
  if (validationError) {
    emit('variant-add-result', { success: false, message: validationError })
    error.value = validationError
    return
  }

  try {
    submitting.value = true
    let variants = []
    if (!showAdditionalOptions.value) {
      // Multi-select main values, no additional
      variants = form.value.product_option_value_ids.map(mainId => {
        return {
          buy_price: form.value.buy_price,
          sell_price: form.value.sell_price,
          image: form.value.image,
          ean13: form.value.ean13,
          name: `${props.productName} (${optionValues.value.find(v => v.id === mainId)?.value || mainId})`,
          option_value_ids: [mainId],
          product_id: props.productId
        }
      })
    } else {
      // Single-select main value, multi-select additional
      const mainId = form.value.product_option_value_ids[0]
      variants = selectedAdditionalOptionValues.value.map(valId => {
        const additionalObj = additionalOptionValues.value.find(v => v.id === valId)
        return {
          buy_price: form.value.buy_price,
          sell_price: form.value.sell_price,
          image: form.value.image,
          ean13: form.value.ean13,
          name: `${props.productName} (${optionValues.value.find(v => v.id === mainId)?.value || mainId} - ${additionalObj?.value || valId})`,
          option_value_ids: [mainId, valId],
          product_id: props.productId
        }
      })
    }
    const result = await createProductVariant(props.productId, variants)
    if (result?.status === false) {
      emit('variant-add-result', { success: false, message: result?.error || 'Failed to create variant' })
      error.value = result?.error || 'Failed to create variant'
      return
    }
    emit('variant-add-result', { success: true, message: result?.message || 'Variant(s) created successfully!' })
    emit('variant-added', result)
    emit('close')
  } catch (err) {
    emit('variant-add-result', { success: false, message: err?.response?.message || err?.error || err?.response?.error || 'Failed to create variant' })
    error.value = err.message || err?.error || err?.response?.error || 'Failed to create variant'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="h-full">
    <template v-if="loading">
      <div class="flex items-center justify-center h-full">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    </template>

    <template v-else>
      <form @submit.prevent class="space-y-6 px-4 py-5">
        <!-- Error Message (no longer needed, handled by parent via toast) -->
        <!-- <div v-if="error" class="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
          {{ error }}
        </div> -->

        <!-- Preview of variant name -->
        <div v-if="variantName" class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">Variant nomini ko'rinishi</h3>
          <p class="text-gray-700 dark:text-gray-300">{{ variantName }}</p>
        </div>

        <!-- Option Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Variant nomi <span class="text-red-500">*</span>
          </label>
          <select
            v-model="selectedOptionId"
            @change="handleOptionChange"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Variant nomini tanlang</option>
            <option v-for="option in productOptions" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </select>
        </div>

        <!-- Option Values -->
        <div v-if="optionValues.length > 0">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Variant qiymati <span class="text-red-500">*</span>
          </label>
          <template v-if="!showAdditionalOptions">
            <!-- Multi-select main value -->
            <div class="relative">
              <div 
                class="w-full min-h-[42px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 focus-within:ring-2 focus-within:ring-indigo-500 cursor-pointer"
                @click="multiMainDropdownOpen = true"
                tabindex="0"
              >
                <div class="flex flex-wrap gap-2">
                  <template v-if="form.product_option_value_ids.length">
                    <div 
                      v-for="val in form.product_option_value_ids" 
                      :key="val"
                      class="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900 text-sm"
                    >
                      <span>{{ optionValues.find(v => v.id === val)?.value || val }}</span>
                      <button 
                        @click.stop="form.product_option_value_ids = form.product_option_value_ids.filter(v => v !== val)"
                        class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                      >
                        ×
                      </button>
                    </div>
                  </template>
                  <div v-else class="text-gray-500 dark:text-gray-400 py-1 text-sm">
                    Qiymatlarni tanlang...
                  </div>
                </div>
              </div>
              <!-- Dropdown -->
              <div 
                v-if="multiMainDropdownOpen" 
                class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg"
                @mousedown.stop
              >
                <div class="p-2 relative">
                  <input
                    type="text"
                    v-model="mainSearch"
                    placeholder="Qiymatlarni qidirish..."
                    class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                    @mousedown.stop
                  />
                  <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600" @mousedown.stop.prevent="closeMainDropdown()">×</button>
                </div>
                <div class="max-h-60 overflow-y-auto">
                  <div 
                    v-for="value in optionValues.filter(v => v.value.toLowerCase().includes(mainSearch.toLowerCase()))" 
                    :key="value.id"
                    class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm flex items-center gap-2"
                    @mousedown.stop.prevent="
                      // If additional options enabled, only allow one
                      showAdditionalOptions
                        ? (form.product_option_value_ids = [value.id], closeMainDropdown())
                        : (
                          form.product_option_value_ids = form.product_option_value_ids.includes(value.id)
                            ? form.product_option_value_ids.filter(v => v !== value.id)
                            : [...form.product_option_value_ids, value.id]
                          // Do NOT close dropdown for multi-select!
                        )
                    "
                  >
                    <input 
                      type="checkbox" 
                      :checked="form.product_option_value_ids.includes(value.id)"
                      class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      @change.prevent
                    />
                    <span>{{ value.value }}</span>
                  </div>
                  <div 
                    v-if="!optionValues.filter(v => v.value.toLowerCase().includes(mainSearch.toLowerCase())).length" 
                    class="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm"
                  >
                    Qiymat topilmadi
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <!-- Single-select main value -->
            <select
              v-model="singleMainValue"
              @change="handleOptionValueChange"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Variant qiymatini tanlang</option>
              <option v-for="value in optionValues" :key="value.id" :value="value.id">
                {{ value.value }}
              </option>
            </select>
          </template>
        </div>
        
        
        <!-- Additional Options Checkbox and Selectors -->
        <div v-if="form.product_option_value_ids.length <= 1">
          <label class="flex items-center mt-4 text-white">
            <input type="checkbox" v-model="showAdditionalOptions" class="mr-2" :disabled="form.product_option_value_ids.length !== 1">
            Qo'shimcha variant qo'shmoqchimisiz?
          </label>
          <div v-if="showAdditionalOptions" class="mt-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Qo'shimcha variant nomi
            </label>
            <select
              v-model="additionalOptionId"
              @change="handleAdditionalOptionChange"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Variant nomini tanlang</option>
              <option v-for="option in productOptions.filter(o => o.id !== selectedOptionId)" :key="option.id" :value="option.id">
                {{ option.name }}
              </option>
            </select>
            <div v-if="additionalOptionValues.length > 0" class="mt-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Qo'shimcha variant qiymati
              </label>
              <div class="relative">
                <div 
                  class="w-full min-h-[42px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 focus-within:ring-2 focus-within:ring-indigo-500 cursor-pointer"
                  @click="showAdditionalDropdown = true"
                >
                  <div class="flex flex-wrap gap-2">
                    <template v-if="selectedAdditionalOptionValues.length">
                      <div 
                        v-for="val in selectedAdditionalOptionValues" 
                        :key="val"
                        class="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900 text-sm"
                      >
                        <span>{{ additionalOptionValues.find(v => v.id === val)?.value || val }}</span>
                        <button 
                          @click.stop="selectedAdditionalOptionValues = selectedAdditionalOptionValues.filter(v => v !== val)"
                          class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                        >
                          ×
                        </button>
                      </div>
                    </template>
                    <div v-else class="text-gray-500 dark:text-gray-400 py-1 text-sm">
                      Qiymatlarni tanlang...
                    </div>
                  </div>
                </div>
                <!-- Dropdown -->
                <div 
                  v-if="showAdditionalDropdown" 
                  class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg"
                  @mousedown.stop
                >
                  <div class="p-2 relative">
                    <input
                      type="text"
                      v-model="additionalSearch"
                      placeholder="Qiymatlarni qidirish..."
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                      @click.stop
                    />
                    <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600" @mousedown.stop.prevent="closeAdditionalDropdown()">×</button>
                  </div>
                  <div class="max-h-60 overflow-y-auto">
                    <div 
                      v-for="value in additionalOptionValues.filter(v => v.value.toLowerCase().includes(additionalSearch.toLowerCase()))" 
                      :key="value.id"
                      class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm flex items-center gap-2"
                      @mousedown.stop.prevent="
                        selectedAdditionalOptionValues = selectedAdditionalOptionValues.includes(value.id)
                          ? selectedAdditionalOptionValues.filter(v => v !== value.id)
                          : [...selectedAdditionalOptionValues, value.id]
                      "
                    >
                      <input 
                        type="checkbox" 
                        :checked="selectedAdditionalOptionValues.includes(value.id)"
                        class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        @change.prevent
                      />
                      <span>{{ value.value }}</span>
                    </div>
                    <div 
                      v-if="!additionalOptionValues.filter(v => v.value.toLowerCase().includes(additionalSearch.toLowerCase())).length" 
                      class="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm"
                    >
                      Qiymat topilmadi
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing Section -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
          <h3 class="font-medium text-gray-900 dark:text-white">Narxlar</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kassa narxi
              </label>
              <NumberInput
                v-model="form.buy_price"
                placeholder="0.00"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sotish narxi
              </label>
              <NumberInput
                v-model="form.sell_price"
                placeholder="0.00"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- SKU and EAN Section -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
          <h3 class="font-medium text-gray-900 dark:text-white">Mahsulot identifikatorlari</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                EAN13
              </label>
              <input
                v-model="form.ean13"
                type="text"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter EAN13"
              />
            </div>
          </div>
        </div>

        <!-- Image Upload -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-2">
          <h3 class="font-medium text-gray-900 dark:text-white">Rasm</h3>
          <ImageUpload @image-selected="handleImageSelected" />
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
          <Button 
            type="button" 
            variant="secondary" 
            :loading="submitting"
            :disabled="submitting"
            @click="$emit('close')"
          >
            Bekor qilish
          </Button>
          <Button 
            type="submit"
            variant="primary"
            :loading="submitting"
            :disabled="submitting"
            @click="handleSubmit"
          >
            {{ submitting ? "Qo'shilmoqda" : "Qo'shish" }}
          </Button>
        </div>
      </form>
    </template>
  </div>
</template>