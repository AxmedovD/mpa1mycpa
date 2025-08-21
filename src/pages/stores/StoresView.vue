<template>

  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Stores</h1>
      <button 
        @click="showAddStoreModal = true"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Add Store
      </button>
    </div>
    
    <!-- Status message for Telegram username updates -->
    <div v-if="updateMessage" class="mb-4">
      <div :class="{
        'bg-green-100 border-green-400 text-green-700 dark:bg-green-800 dark:border-green-600 dark:text-green-200': updateSuccess,
        'bg-red-100 border-red-400 text-red-700 dark:bg-red-800 dark:border-red-600 dark:text-red-200': !updateSuccess
      }" class="border-l-4 p-4 rounded">
        <div class="flex items-center">
          <div v-if="updateSuccess" class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div v-else class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <p>{{ updateMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input 
            v-model="filters.search" 
            type="text" 
            placeholder="Search by name or article"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <!-- Group Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group</label>
          <select 
            v-model="filters.group_id" 
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Groups</option>
            <option value="47">Group 47</option>
            <option value="48">Group 48</option>
          </select>
        </div>
        
        <!-- Action buttons -->
        <div class="flex items-end">
          <button 
            @click="applyFilters" 
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md mr-2"
          >
            Filter
          </button>
          <button 
            @click="resetFilters" 
            class="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-md"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Stores Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th @click="toggleSort('id')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center">
                <span>ID</span>
                <span v-if="sortField === 'id'" class="ml-1">
                  <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </th>
            <th @click="toggleSort('name')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center">
                <span>Name</span>
                <span v-if="sortField === 'name'" class="ml-1">
                  <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </th>
            <th @click="toggleSort('store_name')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center">
                <span>Store Name</span>
                <span v-if="sortField === 'store_name'" class="ml-1">
                  <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </th>
            <th @click="toggleSort('username')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center">
                <span>Username</span>
                <span v-if="sortField === 'username'" class="ml-1">
                  <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </th>
            <th @click="toggleSort('article')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center">
                <span>Article</span>
                <span v-if="sortField === 'article'" class="ml-1">
                  <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </th>
            <th @click="toggleSort('telegram_username')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center">
                <span>Telegram</span>
                <span v-if="sortField === 'telegram_username'" class="ml-1">
                  <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </th>
            <th @click="toggleSort('group_name')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center">
                <span>Group</span>
                <span v-if="sortField === 'group_name'" class="ml-1">
                  <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </th>
            <!-- <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th> -->
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="loading">
            <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </td>
          </tr>
          <tr v-else-if="sortedStores.length === 0">
            <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No stores found
            </td>
          </tr>
          <tr v-for="store in sortedStores" :key="store.id" class="group hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ store.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ store.user?.name || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ store.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ store.user?.username || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ store.article }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              <!-- Edit mode -->
              <div v-if="editingTelegramId === store.id" class="flex items-center space-x-2">
                <input 
                  v-model="editingTelegramUsername" 
                  type="text" 
                  class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  :disabled="updatingTelegram"
                />
                <button 
                  @click="updateTelegramUsername(store.id)" 
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  :disabled="updatingTelegram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button 
                  @click="cancelEditingTelegram" 
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  :disabled="updatingTelegram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <!-- Display mode -->
              <div v-else class="flex items-center justify-between">
                <span>{{ store.user?.telegram_username || '-' }}</span>
                <button 
                  @click="startEditingTelegram(store)" 
                  class="ml-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ store.group_name }}</td>
            <!-- <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">Edit</button>
              <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <Pagination 
      :meta="pagination" 
      @page-change="handlePageChange" 
      @per-page-change="handlePerPageChange"
    />

    <!-- Add Store Modal -->
    <div v-if="showAddStoreModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Store</h3>
          
          <form @submit.prevent="createStore" class="space-y-4">
            <!-- User Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Name</label>
              <input 
                v-model="storeForm.name" 
                type="text" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <!-- Store Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Store Name</label>
              <input 
                v-model="storeForm.store_name" 
                type="text" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <!-- Username -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input 
                v-model="storeForm.username" 
                type="text" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <!-- Article -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Article</label>
              <input 
                v-model="storeForm.article" 
                type="text" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <!-- Telegram Username -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telegram Username</label>
              <input 
                v-model="storeForm.telegram_username" 
                type="text" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input 
                v-model="storeForm.password" 
                type="password" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <!-- Email (Optional) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email (Optional)</label>
              <input 
                v-model="storeForm.email" 
                type="email" 
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                @click="showAddStoreModal = false" 
                class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                :disabled="creating" 
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <svg v-if="creating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Create Store
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'
import { getAuthHeaders } from '@/services/auth'
import Pagination from '@/components/common/Pagination.vue'

// API URL
const API_URL = ''

// Stores data
const stores = ref([])
const loading = ref(false)
const error = ref(null)
const showAddStoreModal = ref(false)
const creating = ref(false)

// Sorting state
const sortField = ref('name')
const sortDirection = ref('asc')

// Inline editing state
const editingTelegramId = ref(null)
const editingTelegramUsername = ref('')
const updatingTelegram = ref(false)
const updateMessage = ref('')
const updateSuccess = ref(false)

// Pagination
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0,
  this_page: 0,
  filtered_total: 0
})

// Filters
const filters = reactive({
  search: '',
  group_id: '',
  page: 1,
  per_page: 20
})

// Store form
const storeForm = reactive({
  name: '',
  store_name: '',
  username: '',
  article: '',
  telegram_username: '',
  password: '',
  email: ''
})

// Apply filters
const applyFilters = () => {
  filters.page = 1
  fetchStores()
}

// Reset filters
const resetFilters = () => {
  filters.search = ''
  filters.group_id = ''
  filters.page = 1
  fetchStores()
}

// Handle page change
const handlePageChange = (page) => {
  filters.page = page
  fetchStores()
}

// Handle per page change
const handlePerPageChange = (perPage) => {
  filters.per_page = perPage
  filters.page = 1
  fetchStores()
}

// Telegram username editing functions
const startEditingTelegram = (store) => {
  editingTelegramId.value = store.id
  editingTelegramUsername.value = store.user?.telegram_username || ''
}

const cancelEditingTelegram = () => {
  editingTelegramId.value = null
  editingTelegramUsername.value = ''
  updateMessage.value = ''
}

const updateTelegramUsername = async (storeId) => {
  updatingTelegram.value = true
  updateMessage.value = ''
  updateSuccess.value = false
  
  try {
    const headers = await getAuthHeaders()
    
    const response = await axios.patch(
      `${API_URL}/stores/store/${storeId}/telegram-username`,
      { telegram_username: editingTelegramUsername.value },
      { headers }
    )
    
    if (response.data && response.data.status !== false) {
      // Update the store in the local array
      const storeIndex = stores.value.findIndex(s => s.id === storeId)
      if (storeIndex !== -1) {
        if (!stores.value[storeIndex].user) {
          stores.value[storeIndex].user = {}
        }
        stores.value[storeIndex].user.telegram_username = editingTelegramUsername.value
      }
      
      updateSuccess.value = true
      updateMessage.value = 'Telegram username updated successfully'
      
      // Reset editing state
      editingTelegramId.value = null
      editingTelegramUsername.value = ''
    } else {
      updateSuccess.value = false
      updateMessage.value = response.data?.message || 'Failed to update Telegram username'
    }
  } catch (err) {
    updateSuccess.value = false
    updateMessage.value = err.response?.data?.message || 'An error occurred while updating Telegram username'
    console.error('Error updating Telegram username:', err)
  } finally {
    updatingTelegram.value = false
    
    // Clear message after 3 seconds
    setTimeout(() => {
      updateMessage.value = ''
      updateSuccess.value = false
    }, 3000)
  }
}

// Fetch stores from API
const fetchStores = async () => {
  loading.value = true
  error.value = null
  
  try {
    const headers = await getAuthHeaders()
    
    // Build query parameters
    const params = new URLSearchParams()
    params.append('page', filters.page)
    params.append('per_page', filters.per_page)
    
    if (filters.search) {
      params.append('search', filters.search)
    }
    
    if (filters.group_id) {
      params.append('group_id', filters.group_id)
    }
    
    const response = await axios.get(`${API_URL}/stores/get`, { 
      headers,
      params
    })
    
    if (response.data.status) {
      stores.value = response.data.data
      
      // Update pagination
      pagination.value = {
        current_page: response.data.meta.current_page,
        last_page: response.data.meta.last_page,
        per_page: filters.per_page,
        total: response.data.meta.total || 0,
        this_page: stores.value.length,
        filtered_total: response.data.meta.total || 0
      }
    } else {
      error.value = response.data.message || 'Failed to fetch stores'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred while fetching stores'
    console.error('Error fetching stores:', err)
  } finally {
    loading.value = false
  }
}

// Create new store
const createStore = async () => {
  creating.value = true
  
  try {
    const headers = await getAuthHeaders()
    
    const response = await axios.post(`${API_URL}/stores/create`, storeForm, { headers })
    
    if (response.data.status) {
      // Reset form and close modal
      storeForm.name = ''
      storeForm.store_name = ''
      storeForm.username = ''
      storeForm.article = ''
      storeForm.telegram_username = ''
      storeForm.password = ''
      storeForm.email = ''
      
      showAddStoreModal.value = false
      
      // Refresh stores list
      filters.page = 1
      fetchStores()
    } else {
      error.value = response.data.message || 'Failed to create store'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred while creating store'
    console.error('Error creating store:', err)
  } finally {
    creating.value = false
  }
}

// Sort stores based on current sort field and direction
const sortedStores = computed(() => {
  if (!stores.value.length) return []
  
  return [...stores.value].sort((a, b) => {
    let aValue, bValue
    
    // Handle nested properties
    if (sortField.value === 'name') {
      aValue = a.user?.name || ''
      bValue = b.user?.name || ''
    } else if (sortField.value === 'username') {
      aValue = a.user?.username || ''
      bValue = b.user?.username || ''
    } else if (sortField.value === 'telegram_username') {
      aValue = a.user?.telegram_username || ''
      bValue = b.user?.telegram_username || ''
    } else {
      aValue = a[sortField.value] || ''
      bValue = b[sortField.value] || ''
    }
    
    // Case insensitive string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    // Sort direction
    if (sortDirection.value === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
  })
})

// Sort handler
const toggleSort = (field) => {
  if (sortField.value === field) {
    // Toggle direction if same field
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // New field, default to ascending
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

// Initialize
onMounted(() => {
  fetchStores()
})
</script>
