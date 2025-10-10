<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>
    
    <template v-else>
      <!-- Header section -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ offer.name }}
            <span class="text-gray-500 dark:text-gray-400 text-lg ml-2">#{{ offer.id }}</span>
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            User: {{ offer.user?.username || 'Unknown' }}
          </p>
        </div>
        
        <div class="mt-4 md:mt-0 flex flex-wrap items-center gap-3">
          <span 
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="getStatusClass(offer.status?.code)"
          >
            {{ offer.status?.name || 'Unknown Status' }}
          </span>
          
          <button 
            @click="showStatusModal = true" 
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Change Status
          </button>
          
          <button 
            @click="openEditModal()" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Edit
          </button>
          
          <button 
            @click="showDeleteModal = true" 
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button 
            @click="activeTab = 'details'" 
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === 'details' 
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
          >
            Details
          </button>
          <button 
            @click="activeTab = 'payments'" 
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === 'payments' 
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
          >
            Payments
          </button>
          <button 
            @click="activeTab = 'products'" 
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === 'products' 
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
          >
            Products
          </button>
        </nav>
      </div>
      
      <!-- Tab content -->
      <div>
        <!-- Details tab -->
        <div v-if="activeTab === 'details'">
          <OfferDetailsCard 
            :offer="offer" 
            @update-landing="updateLanding"
            @update-creative="updateCreative"
          />
        </div>
        
        <!-- Payments tab -->
        <div v-if="activeTab === 'payments'">
          <OfferPaymentsTable 
            :payments="offer.offer_pays || []" 
            @edit-payment="editPayment"
            @delete-payment="deletePayment"
            @add-payment="addPayment"
          />
        </div>
        
        <!-- Products tab -->
        <div v-if="activeTab === 'products'">
          <OfferProductsList :products="offer.offer_products || []" :offer-id="offerId" />
        </div>
      </div>
      
      <!-- Status change modal -->
      <div v-if="showStatusModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Status</h3>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select 
                v-model="selectedStatus" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option v-for="status in statuses" :key="status.id" :value="status.id">
                  {{ status.name }}
                </option>
              </select>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                @click="showStatusModal = false" 
                class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                @click="updateStatus" 
                :disabled="statusUpdating" 
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <svg v-if="statusUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delete confirmation modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Delete Offer</h3>
            
            <p class="text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete this offer? This action cannot be undone.
            </p>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                @click="showDeleteModal = false" 
                class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                @click="deleteOffer" 
                :disabled="deleting" 
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <svg v-if="deleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Edit Offer Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit Offer</h3>
            
            <form @submit.prevent="saveOfferChanges" class="space-y-6">
              <!-- Basic Information Section -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                  Basic Information
                </h4>
                
                <!-- Name -->
                <div>
                  <label for="offer-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Offer Name <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="offer-name" 
                    v-model="editForm.name" 
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter offer name"
                  />
                </div>
                
                <!-- Description -->
                <div>
                  <label for="offer-desc" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea 
                    id="offer-desc" 
                    v-model="editForm.desc" 
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-y min-h-[80px] max-h-[300px]"
                    placeholder="Enter offer description"
                  ></textarea>
                </div>
              </div>
              
              <!-- Configuration Section -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                  Configuration
                </h4>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <!-- Group ID -->
                  <div>
                    <label for="group-id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Group ID</label>
                    <input 
                      type="text" 
                      id="group-id" 
                      v-model="editForm.group_id" 
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter group ID"
                    />
                  </div>
                  
                  <!-- Shipping Method ID -->
                  <div>
                    <label for="shipping-method-id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shipping Method ID</label>
                    <input 
                      type="text" 
                      id="shipping-method-id" 
                      v-model="editForm.shipping_method_id" 
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter shipping method ID"
                    />
                  </div>
                  
                  <!-- Tariff ID -->
                  <div>
                    <label for="tariff-id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tariff ID</label>
                    <input 
                      type="text" 
                      id="tariff-id" 
                      v-model="editForm.tariff_id" 
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter tariff ID"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Image Upload Section -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                  Offer Image
                </h4>
                  
                  <!-- Current Image Display -->
                  <div v-if="editForm.image_url && editForm.image_url.trim() !== ''" class="mb-3">
                    <div class="relative inline-block">
                      <img 
                        :src="editForm.image_url" 
                        alt="Current offer image" 
                        class="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        @error="handleImageError"
                        @load="console.log('Image loaded successfully:', editForm.image_url)"
                      />
                      <button
                        type="button"
                        @click="showChangeImage = true"
                        class="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        title="Change image"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Click the edit icon to change image</p>
                  </div>
                  
                  <!-- No Image Placeholder -->
                  <div v-else-if="!showChangeImage" class="mb-3">
                    <div class="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">No image uploaded</p>
                    <button
                      type="button"
                      @click="showChangeImage = true"
                      class="text-sm text-indigo-600 hover:text-indigo-500 mt-1"
                    >
                      Upload image
                    </button>
                  </div>
                  
                  <!-- Image Upload Area -->
                  <div v-if="!editForm.image_url || showChangeImage" class="space-y-3">
                    <!-- Drag & Drop Area -->
                    <div 
                      @drop="handleDrop"
                      @dragover.prevent
                      @dragenter.prevent
                      @dragleave="isDragOver = false"
                      @dragover="isDragOver = true"
                      :class="[
                        'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                        isDragOver 
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                      ]"
                    >
                      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div class="mt-4">
                        <label for="single-image-upload" class="cursor-pointer">
                          <span class="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Drop image here or 
                            <span class="text-indigo-600 hover:text-indigo-500">browse</span>
                          </span>
                        </label>
                        <input 
                          id="single-image-upload" 
                          type="file" 
                          class="hidden" 
                          accept="image/*"
                          @change="handleFileSelect"
                        />
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        PNG, JPG, GIF up to 2MB
                      </p>
                    </div>
                    
                    <!-- Selected Image Preview -->
                    <div v-if="selectedImageFile" class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <img 
                        :src="selectedImagePreview" 
                        alt="Selected image" 
                        class="w-16 h-16 object-cover rounded"
                      />
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedImageFile.name }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(selectedImageFile.size) }}</p>
                      </div>
                      <button
                        type="button"
                        @click="clearSelectedImage"
                        class="text-red-600 hover:text-red-700 focus:outline-none"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <!-- Upload Button -->
                    <button
                      v-if="selectedImageFile"
                      type="button"
                      @click="uploadImage"
                      :disabled="isUploadingImage"
                      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ isUploadingImage ? 'Uploading...' : 'Upload Image' }}
                    </button>
                    
                    <!-- Cancel Change Button -->
                    <button
                      v-if="editForm.image_url && showChangeImage"
                      type="button"
                      @click="cancelImageChange"
                      class="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
              </div>
              
              <!-- Settings Section -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                  Settings
                </h4>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Landing Page Toggle -->
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Landing Page Exists</span>
                  <div class="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      id="edit-landing-toggle" 
                      v-model="editForm.is_exist_landing" 
                      class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label 
                      for="edit-landing-toggle" 
                      class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    ></label>
                  </div>
                </div>
                
                  <!-- Creative Toggle -->
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Creative Exists</span>
                    <div class="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="edit-creative-toggle" 
                        v-model="editForm.is_exist_creative" 
                        class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label 
                        for="edit-creative-toggle" 
                        class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      ></label>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Form Actions -->
              <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button 
                  type="button"
                  @click="showEditModal = false" 
                  class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  :disabled="saving"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Payment Edit Modal -->
      <PaymentEditModal 
        v-if="showPaymentModal" 
        :payment="selectedPayment" 
        :is-new="isNewPayment" 
        :offer-id="offerId"
        @save="savePayment" 
        @close="closePaymentModal" 
      />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { getAuthHeaders } from '../../services/auth'
import { useToast } from 'vue-toastification'
import OfferDetailsCard from '../../components/offers/offersingle/OfferDetailsCard.vue'
import OfferPaymentsTable from '../../components/offers/offersingle/OfferPaymentsTable.vue'
import OfferProductsList from '../../components/offers/offersingle/OfferProductsList.vue'
import PaymentEditModal from '../../components/offers/offersingle/PaymentEditModal.vue'

const route = useRoute()
const router = useRouter()
const offerId = route.params.id
const toast = useToast()

// State
const offer = ref({})
const loading = ref(true)
const error = ref(null)
const activeTab = ref('details')
const statuses = ref([])

// Modal state
const showStatusModal = ref(false)
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const editForm = ref({})
const saving = ref(false)

// Image upload state
const selectedImageFile = ref(null)
const selectedImagePreview = ref('')
const isUploadingImage = ref(false)
const showChangeImage = ref(false)
const isDragOver = ref(false)

// Initialize edit form with offer data
const openEditModal = () => {
  console.log('Opening edit modal with offer data:', offer.value)
  editForm.value = {
    name: offer.value.name,
    desc: offer.value.desc || '',
    group_id: offer.value.group_id || '',
    shipping_method_id: offer.value.shipping_method_id || '',
    tariff_id: offer.value.tariff_id || '',
    image_url: offer.value.img || offer.value.image_url || offer.value.image || '',
    is_exist_landing: offer.value.is_exist_landing || false,
    is_exist_creative: offer.value.is_exist_creative || false
  }
  console.log('Edit form initialized with image_url:', editForm.value.image_url)
  
  // Reset image upload state
  selectedImageFile.value = null
  selectedImagePreview.value = ''
  showChangeImage.value = false
  isDragOver.value = false
  isUploadingImage.value = false
  
  showEditModal.value = true
}

// Save offer changes
const saveOfferChanges = async () => {
  try {
    saving.value = true
    const headers = await getAuthHeaders()
    
    // Prepare the payload according to the API structure
    const payload = {
      name: editForm.value.name,
      desc: editForm.value.desc,
      img: editForm.value.image_url,
      is_exist_landing: editForm.value.is_exist_landing,
      is_exist_creative: editForm.value.is_exist_creative
    }
    
    // Only add these fields if they have non-null values
    if (editForm.value.group_id && editForm.value.group_id !== 'null') {
      payload.group_id = Number(editForm.value.group_id)
    }
    
    if (editForm.value.shipping_method_id && editForm.value.shipping_method_id !== 'null') {
      payload.shipping_method_id = Number(editForm.value.shipping_method_id)
    }
    
    if (editForm.value.tariff_id && editForm.value.tariff_id !== 'null') {
      payload.tariff_id = Number(editForm.value.tariff_id)
    }
    
    // Filter out undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key]
      }
    })
    
    const response = await axios.put(
      `${API_URL}/offers/offer/${offerId}`,
      payload,
      { headers }
    )
    
    if (response.data.status) {
      // Update local state with new data
      Object.assign(offer.value, {
        name: editForm.value.name,
        desc: editForm.value.desc,
        image_url: editForm.value.image_url,
        group_id: editForm.value.group_id,
        shipping_method_id: editForm.value.shipping_method_id,
        tariff_id: editForm.value.tariff_id,
        is_exist_landing: editForm.value.is_exist_landing,
        is_exist_creative: editForm.value.is_exist_creative
      })
      showEditModal.value = false
    } else {
      error.value = response.data.message || 'Failed to update offer'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred while updating offer'
    console.error('Error updating offer:', err)
  } finally {
    saving.value = false
  }
}

const showPaymentModal = ref(false)
const selectedStatus = ref(null)
const statusUpdating = ref(false)
const deleting = ref(false)

// Payment state
const selectedPayment = ref(null)
const isNewPayment = ref(false)

// Fetch offer data
const fetchOffer = async () => {
  try {
    loading.value = true
    const headers = await getAuthHeaders()
    const response = await axios.get(`${API_URL}/offers/offer/${offerId}`, { headers })
    
    if (response.data.status) {
      offer.value = response.data.data
      selectedStatus.value = offer.value.status?.id
    } else {
      error.value = response.data.message || 'Failed to fetch offer details'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    console.error('Error fetching offer:', err)
  } finally {
    loading.value = false
  }
}

// Fetch statuses for dropdown
const fetchStatuses = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.get(`${API_URL}/statuses/get`, { 
      headers,
      params: { per_page: 100, is_active: true, type_id: 2 }
    })
    
    if (response.data.status) {
      statuses.value = response.data.data
    }
  } catch (err) {
    console.error('Error fetching statuses:', err)
  }
}

// Update offer status
const updateStatus = async () => {
  try {
    statusUpdating.value = true
    const headers = await getAuthHeaders()
    
    const response = await axios.patch(
      `${API_URL}/offers/${offerId}/status`, 
      { status_id: selectedStatus.value }, 
      { headers }
    )
    
    if (response.data.status) {
      // Update local state
      const newStatus = statuses.value.find(s => s.id === selectedStatus.value)
      if (newStatus) {
        offer.value.status = newStatus
      }
      showStatusModal.value = false
    } else {
      error.value = response.data.message || 'Failed to update status'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    console.error('Error updating status:', err)
  } finally {
    statusUpdating.value = false
  }
}

// Delete offer
const deleteOffer = async () => {
  try {
    deleting.value = true
    const headers = await getAuthHeaders()
    
    const response = await axios.delete(`${API_URL}/offers/${offerId}`, { headers })
    
    if (response.data.status) {
      // Redirect to offers list
      router.push('/offers')
    } else {
      error.value = response.data.message || 'Failed to delete offer'
      showDeleteModal.value = false
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    console.error('Error deleting offer:', err)
    showDeleteModal.value = false
  } finally {
    deleting.value = false
  }
}

// Update landing page flag
const updateLanding = async (value) => {
  try {
    const headers = await getAuthHeaders()
    
    const response = await axios.put(
      `${API_URL}/offers/offer/${offerId}`, 
      { is_exist_landing: value }, 
      { headers }
    )
    
    if (response.data.status) {
      offer.value.is_exist_landing = value
    }
  } catch (err) {
    console.error('Error updating landing flag:', err)
    // Revert toggle if failed
    offer.value.is_exist_landing = !value
  }
}

// Update creative flag
const updateCreative = async (value) => {
  try {
    const headers = await getAuthHeaders()
    
    const response = await axios.put(
      `${API_URL}/offers/offer/${offerId}`, 
      { is_exist_creative: value }, 
      { headers }
    )
    
    if (response.data.status) {
      offer.value.is_exist_creative = value
    }
  } catch (err) {
    console.error('Error updating creative flag:', err)
    // Revert toggle if failed
    offer.value.is_exist_creative = !value
  }
}

// Payment actions
const editPayment = (payment) => {
  selectedPayment.value = { ...payment }
  isNewPayment.value = false
  showPaymentModal.value = true
}

const deletePayment = async (paymentId) => {
  if (!confirm('Are you sure you want to delete this payment?')) return
  
  try {
    const headers = await getAuthHeaders()
    const response = await axios.delete(`${API_URL}/offers/payments/${paymentId}`, { headers })
    
    if (response.data.status) {
      // Remove payment from local state
      offer.value.offer_pays = offer.value.offer_pays.filter(p => p.id !== paymentId)
    } else {
      error.value = response.data.message || 'Failed to delete payment'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred while deleting payment'
    console.error('Error deleting payment:', err)
  }
}

const addPayment = () => {
  selectedPayment.value = {}
  isNewPayment.value = true
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedPayment.value = null
}

const savePayment = async (paymentData) => {
  try {
    const headers = await getAuthHeaders()
    
    // Prepare the payload for the unified offer update endpoint
    const payload = {
      // Include only payment-related fields
      sell_price: paymentData.sell_price,
      pay_web: paymentData.pay_web,
      add_manager: paymentData.add_manager,
      two_plus_one: paymentData.two_plus_one,
      fbs: paymentData.fbs,
      pvz: paymentData.pvz,
      free1: paymentData.free1,
      free2: paymentData.free2
    }
    
    // Only add these fields if they have non-null values
    if (paymentData.shipping_method_id && paymentData.shipping_method_id !== 'null') {
      payload.shipping_method_id = paymentData.shipping_method_id
    }
    
    if (paymentData.tariff_id && paymentData.tariff_id !== 'null') {
      payload.tariff_id = paymentData.tariff_id
    }
    
    if (paymentData.group_id && paymentData.group_id !== 'null') {
      payload.group_id = paymentData.group_id
    }
    
    // Filter out undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key]
      }
    })
    
    // Send to the unified offer update endpoint
    const response = await axios.put(
      `${API_URL}/offers/offer/${offerId}`,
      payload,
      { headers }
    )
    
    if (response.data.status) {
      // Refresh offer data to get updated payments
      await fetchOffer()
      closePaymentModal()
    } else {
      error.value = response.data.message || 'Failed to save payment'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred while saving payment'
    console.error('Error saving payment:', err)
  }
}

// Image handling methods
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processSelectedFile(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    processSelectedFile(files[0])
  }
}

const processSelectedFile = (file) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file')
    return
  }
  
  // Validate file size (2MB limit)
  if (file.size > 2 * 1024 * 1024) {
    toast.error('File size must be less than 2MB')
    return
  }
  
  selectedImageFile.value = file
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    selectedImagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const clearSelectedImage = () => {
  selectedImageFile.value = null
  selectedImagePreview.value = ''
  
  // Clear file input
  const fileInput = document.getElementById('single-image-upload')
  if (fileInput) {
    fileInput.value = ''
  }
}

const cancelImageChange = () => {
  showChangeImage.value = false
  clearSelectedImage()
}

const handleImageError = (event) => {
  console.warn('Image failed to load:', editForm.value.image_url)
  event.target.style.display = 'none'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadImage = async () => {
  if (!selectedImageFile.value || !offer.value?.id) {
    return
  }
  
  isUploadingImage.value = true
  
  try {
    const headers = await getAuthHeaders()
    const formData = new FormData()
    formData.append('img', selectedImageFile.value)
    
    const response = await axios.post(
      `${API_URL}/offers/offer/${offer.value.id}/img`,
      formData,
      {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    
    if (response.data.status) {
      // Update the image URL in editForm and offer
      const newImageUrl = response.data.data?.img || response.data.img || selectedImagePreview.value
      editForm.value.image_url = newImageUrl
      offer.value.img = newImageUrl
      
      // Reset upload state
      clearSelectedImage()
      showChangeImage.value = false
      
      toast.success('Image uploaded successfully!')
    } else {
      toast.error(response.data.message || 'Failed to upload image')
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    toast.error(error.response?.data?.message || 'Failed to upload image')
  } finally {
    isUploadingImage.value = false
  }
}

// Handle image preview error
const handleImagePreviewError = (event) => {
  console.warn('Image preview failed to load:', editForm.value.image_url)
  event.target.style.display = 'none'
}

// Get CSS class for status badge
const getStatusClass = (statusCode) => {
  if (!statusCode) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  
  switch (statusCode.toLowerCase()) {
    case 'open':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    case 'closed':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchOffer()
  fetchStatuses()
})
</script>

<style scoped>
/* Toggle Switch Styles */
.toggle-checkbox:checked {
  right: 0;
  border-color: #4f46e5;
  background-color: #4f46e5;
}

.toggle-checkbox:checked + .toggle-label {
  background-color: #4f46e5;
}

.toggle-checkbox {
  transition: all 0.3s ease;
  top: 0;
  left: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  border: 2px solid #d1d5db;
  background-color: #ffffff;
}

.toggle-checkbox:checked {
  transform: translateX(100%);
  border-color: #4f46e5;
  background-color: #ffffff;
}

.toggle-label {
  transition: background-color 0.3s ease;
  width: 2.5rem;
  height: 1.5rem;
  background-color: #d1d5db;
  border-radius: 9999px;
}

.toggle-checkbox:checked + .toggle-label {
  background-color: #4f46e5;
}

/* Dark mode styles */
.dark .toggle-checkbox {
  border-color: #6b7280;
  background-color: #374151;
}

.dark .toggle-label {
  background-color: #6b7280;
}

.dark .toggle-checkbox:checked {
  background-color: #ffffff;
}

.dark .toggle-checkbox:checked + .toggle-label {
  background-color: #4f46e5;
}
</style>
