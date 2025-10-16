<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-2">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">Sub Statuses</h1>
      <button 
        @click="openModal('create')" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Sub Status
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <!-- Basic Filters Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input
            id="search"
            v-model="filters.search"
            type="text"
            placeholder="Search by name or code..."
            @keyup.enter="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label for="status_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            id="status_id"
            v-model="filters.status_id"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option v-for="status in filterData.statuses" :key="status.id" :value="status.id">{{ status.name }}</option>
          </select>
        </div>
        <div>
          <label for="is_active" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Active</label>
          <select
            id="is_active"
            v-model="filters.is_active"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>
      
      <!-- Flag Filters Section -->
      <div class="border-t border-gray-200 dark:border-gray-600 pt-4">
        <div class="flex items-center justify-between mb-3">
          <h5 class="text-sm font-medium text-gray-900 dark:text-white flex items-center">
            <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
            </svg>
            Flag Filters
          </h5>
          <button 
            type="button"
            @click="toggleFlagFilters"
            class="text-xs px-2 py-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {{ showFlagFilters ? 'Hide' : 'Show' }}
          </button>
        </div>
        
        <div v-show="showFlagFilters" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label for="flag_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Flag Type</label>
            <select
              id="flag_type"
              v-model="filters.flag_type"
              @change="onFlagTypeChange"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Flag Types</option>
              <option v-for="flagType in filterData.flag_types" :key="flagType" :value="flagType">
                {{ formatFlagTypeName(flagType) }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="flag_key" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Flag Key</label>
            <select
              id="flag_key"
              v-model="filters.flag_key"
              :disabled="!filters.flag_type"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">All Keys</option>
              <option v-for="flagKey in getCurrentFlagKeys()" :key="flagKey" :value="flagKey">{{ flagKey }}</option>
            </select>
          </div>
          
          <div>
            <label for="flag_value" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Flag Value</label>
            <select
              id="flag_value"
              v-model="filters.flag_value"
              :disabled="!filters.flag_key"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Any Value</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          
          <div>
            <label for="has_flag_key" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Has Flag Key</label>
            <input
              id="has_flag_key"
              v-model="filters.has_flag_key"
              type="text"
              placeholder="e.g. waiting, sold"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div class="flex items-end">
            <button 
              @click="clearFlagFilters" 
              class="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium py-2 px-3 rounded-md text-sm"
            >
              Clear Flags
            </button>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          <span v-if="hasActiveFilters" class="inline-flex items-center">
            <svg class="w-4 h-4 mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
            </svg>
            Filters active
          </span>
        </div>
        <div class="flex space-x-3">
          <button 
            @click="applyFilters" 
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Apply Filters
          </button>
          <button 
            @click="resetFilters" 
            class="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium py-2 px-6 rounded-md transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <!-- No results -->
    <div v-else-if="subStatuses.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">No sub statuses found</p>
    </div>

    <!-- Results table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="subStatuses.length > 0 && selectedSubStatusIds.length === subStatuses.length"
                  @change="toggleSelectAll"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">Status Flags</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">Finance Flags</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">Report Flags</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">Warehouse Flags</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="subStatus in subStatuses" :key="subStatus.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  v-model="selectedSubStatusIds"
                  :value="subStatus.id"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">#{{ subStatus.id }}</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-[300px] break-words">{{ subStatus.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ subStatus.code }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-[250px] break-words">{{ subStatus.status?.name || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span 
                :class="subStatus.is_active 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'" 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ subStatus.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ subStatus.ordering_id || '-' }}</td>
            <td class="px-4 py-4 text-sm">
              <div class="flex flex-wrap gap-1 max-w-[120px]">
                <span 
                  v-for="flag in getSubStatusFlags(subStatus, 'status_flags')" 
                  :key="flag.key"
                  class="px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                >
                  {{ flag.key }}
                </span>
                <span v-if="getSubStatusFlags(subStatus, 'status_flags').length === 0" class="text-gray-400 text-xs">None</span>
              </div>
            </td>
            <td class="px-4 py-4 text-sm">
              <div class="flex flex-wrap gap-1 max-w-[120px]">
                <span 
                  v-for="flag in getSubStatusFlags(subStatus, 'finance_flags')" 
                  :key="flag.key"
                  class="px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                >
                  {{ flag.key }}
                </span>
                <span v-if="getSubStatusFlags(subStatus, 'finance_flags').length === 0" class="text-gray-400 text-xs">None</span>
              </div>
            </td>
            <td class="px-4 py-4 text-sm">
              <div class="flex flex-wrap gap-1 max-w-[120px]">
                <span 
                  v-for="flag in getSubStatusFlags(subStatus, 'report_flags')" 
                  :key="flag.key"
                  class="px-1.5 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                >
                  {{ flag.key }}
                </span>
                <span v-if="getSubStatusFlags(subStatus, 'report_flags').length === 0" class="text-gray-400 text-xs">None</span>
              </div>
            </td>
            <td class="px-4 py-4 text-sm">
              <div class="flex flex-wrap gap-1 max-w-[120px]">
                <span 
                  v-for="flag in getSubStatusFlags(subStatus, 'warehouse_flags')" 
                  :key="flag.key"
                  class="px-1.5 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                >
                  {{ flag.key }}
                </span>
                <span v-if="getSubStatusFlags(subStatus, 'warehouse_flags').length === 0" class="text-gray-400 text-xs">None</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="openModal('edit', subStatus)" 
                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
              >
                Edit
              </button>
              <button 
                @click="confirmDelete(subStatus)" 
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- Pagination -->
      <Pagination 
        v-if="!loading && subStatuses.length > 0" 
        :meta="pagination" 
        @page-change="changePage" 
        @per-page-change="changePerPage"
        class="mt-4"
      />
      
      <!-- Fixed Action Bar -->
      <FixedActions
        :selected-count="selectedSubStatusIds.length"
        :visible="selectedSubStatusIds.length > 0"
        @change-status="openBulkStatusModal"
        @cancel="clearSelection"
      >
        <template #info>
          {{ selectedSubStatusIds.length }} {{ selectedSubStatusIds.length === 1 ? 'sub status' : 'sub statuses' }} selected
        </template>
        <template #actions>
          <button 
            @click="openBulkDeleteModal"
            class="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded-md text-sm mr-2"
          >
            Delete
          </button>
          <button 
            @click="openBulkUpdateModal"
            class="bg-amber-600 hover:bg-amber-700 text-white font-medium py-1.5 px-3 rounded-md text-sm mr-2"
          >
            Bulk Update
          </button>
        </template>
      </FixedActions>

    </div>

    <!-- Sub Status Form Modal -->
    <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="showModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">{{ modalMode === 'create' ? 'Add New Sub Status' : 'Edit Sub Status' }}</h3>
            
            <!-- Modal Loading State -->
            <div v-if="modalLoading" class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <span class="ml-3 text-gray-600 dark:text-gray-400">Loading form data...</span>
            </div>
            
            <form v-else @submit.prevent="submitForm">
              <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div class="mb-4">
                <label for="code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                <input
                  id="code"
                  v-model="formData.code"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div class="mb-4">
                <label for="status_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  id="status_id"
                  v-model="formData.status_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="" disabled>Select a status</option>
                  <option v-for="status in statuses" :key="status.id" :value="status.id">{{ status.name }}</option>
                </select>
              </div>
              <div class="mb-4">
                <label for="ordering_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
                <input
                  id="ordering_id"
                  v-model.number="formData.ordering_id"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <!-- JSON Flags Section -->
              <div class="mb-6 border-t border-gray-200 dark:border-gray-600 pt-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Sub Status Flags Configuration</h4>
                  <div class="flex space-x-2">
                    <button 
                      type="button"
                      @click="selectAllFlags"
                      class="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800 rounded-md transition-colors"
                    >
                      Select All
                    </button>
                    <button 
                      type="button"
                      @click="clearAllFlags"
                      class="text-xs px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                
                <!-- Flags Grid Layout -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Status Flags -->
                  <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div class="flex items-center justify-between mb-3">
                      <label class="text-sm font-medium text-blue-900 dark:text-blue-100 flex items-center">
                        <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        Status Flags
                      </label>
                      <span class="text-xs text-blue-600 dark:text-blue-400">
                        {{ Object.values(formData.flags.status_flags).filter(Boolean).length }}/{{ availableFlags.status_flags?.length || 0 }}
                      </span>
                    </div>
                    <div class="space-y-2 max-h-32 overflow-y-auto">
                      <div v-for="flag in availableFlags.status_flags" :key="flag.key" class="flex items-center">
                        <input
                          :id="`status_flag_${flag.key}`"
                          v-model="formData.flags.status_flags[flag.key]"
                          type="checkbox"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label :for="`status_flag_${flag.key}`" class="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                          {{ flag.key }}
                          <span v-if="flag.description" class="block text-xs text-gray-500 dark:text-gray-400 ml-0">{{ flag.description }}</span>
                        </label>
                      </div>
                      <div v-if="!availableFlags.status_flags?.length" class="text-xs text-gray-500 dark:text-gray-400 italic">
                        No flags available
                      </div>
                    </div>
                  </div>

                  <!-- Finance Flags -->
                  <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div class="flex items-center justify-between mb-3">
                      <label class="text-sm font-medium text-green-900 dark:text-green-100 flex items-center">
                        <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        Finance Flags
                      </label>
                      <span class="text-xs text-green-600 dark:text-green-400">
                        {{ Object.values(formData.flags.finance_flags).filter(Boolean).length }}/{{ availableFlags.finance_flags?.length || 0 }}
                      </span>
                    </div>
                    <div class="space-y-2 max-h-32 overflow-y-auto">
                      <div v-for="flag in availableFlags.finance_flags" :key="flag.key" class="flex items-center">
                        <input
                          :id="`finance_flag_${flag.key}`"
                          v-model="formData.flags.finance_flags[flag.key]"
                          type="checkbox"
                          class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label :for="`finance_flag_${flag.key}`" class="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                          {{ flag.key }}
                          <span v-if="flag.description" class="block text-xs text-gray-500 dark:text-gray-400 ml-0">{{ flag.description }}</span>
                        </label>
                      </div>
                      <div v-if="!availableFlags.finance_flags?.length" class="text-xs text-gray-500 dark:text-gray-400 italic">
                        No flags available
                      </div>
                    </div>
                  </div>

                  <!-- Report Flags -->
                  <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <div class="flex items-center justify-between mb-3">
                      <label class="text-sm font-medium text-purple-900 dark:text-purple-100 flex items-center">
                        <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        Report Flags
                      </label>
                      <span class="text-xs text-purple-600 dark:text-purple-400">
                        {{ Object.values(formData.flags.report_flags).filter(Boolean).length }}/{{ availableFlags.report_flags?.length || 0 }}
                      </span>
                    </div>
                    <div class="space-y-2 max-h-32 overflow-y-auto">
                      <div v-for="flag in availableFlags.report_flags" :key="flag.key" class="flex items-center">
                        <input
                          :id="`report_flag_${flag.key}`"
                          v-model="formData.flags.report_flags[flag.key]"
                          type="checkbox"
                          class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label :for="`report_flag_${flag.key}`" class="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                          {{ flag.key }}
                          <span v-if="flag.description" class="block text-xs text-gray-500 dark:text-gray-400 ml-0">{{ flag.description }}</span>
                        </label>
                      </div>
                      <div v-if="!availableFlags.report_flags?.length" class="text-xs text-gray-500 dark:text-gray-400 italic">
                        No flags available
                      </div>
                    </div>
                  </div>

                  <!-- Warehouse Flags -->
                  <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                    <div class="flex items-center justify-between mb-3">
                      <label class="text-sm font-medium text-orange-900 dark:text-orange-100 flex items-center">
                        <div class="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                        Warehouse Flags
                      </label>
                      <span class="text-xs text-orange-600 dark:text-orange-400">
                        {{ Object.values(formData.flags.warehouse_flags).filter(Boolean).length }}/{{ availableFlags.warehouse_flags?.length || 0 }}
                      </span>
                    </div>
                    <div class="space-y-2 max-h-32 overflow-y-auto">
                      <div v-for="flag in availableFlags.warehouse_flags" :key="flag.key" class="flex items-center">
                        <input
                          :id="`warehouse_flag_${flag.key}`"
                          v-model="formData.flags.warehouse_flags[flag.key]"
                          type="checkbox"
                          class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label :for="`warehouse_flag_${flag.key}`" class="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                          {{ flag.key }}
                          <span v-if="flag.description" class="block text-xs text-gray-500 dark:text-gray-400 ml-0">{{ flag.description }}</span>
                        </label>
                      </div>
                      <div v-if="!availableFlags.warehouse_flags?.length" class="text-xs text-gray-500 dark:text-gray-400 italic">
                        No flags available
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <div class="flex items-center">
                  <input
                    id="is_active"
                    v-model="formData.is_active"
                    type="checkbox"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label for="is_active" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">Active</label>
                </div>
              </div>
            </form>
          </div>
          <div v-if="!modalLoading" class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="submitForm" 
              :disabled="formSubmitting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="formSubmitting" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ modalMode === 'create' ? 'Creating...' : 'Updating...' }}
              </span>
              <span v-else>{{ modalMode === 'create' ? 'Create' : 'Update' }}</span>
            </button>
            <button 
              @click="showModal = false" 
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDeleteModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">Delete Sub Status</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this sub status? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="deleteSubStatus" 
              :disabled="deleteSubmitting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ deleteSubmitting ? 'Deleting...' : 'Delete' }}
            </button>
            <button 
              @click="showDeleteModal = false" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Update Modal -->
    <div v-if="showBulkUpdateModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="showBulkUpdateModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">Bulk Update Sub Statuses</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Update {{ selectedSubStatusIds.length }} selected sub status{{ selectedSubStatusIds.length === 1 ? '' : 'es' }}
            </p>
            <form @submit.prevent="submitBulkUpdate">
              <div class="mb-4">
                <label class="flex items-center mb-2">
                  <input
                    type="checkbox"
                    v-model="bulkUpdateData.updateIsActive"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
                  />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Update Active Status</span>
                </label>
                <select
                  v-if="bulkUpdateData.updateIsActive"
                  v-model="bulkUpdateData.is_active"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="flex items-center mb-2">
                  <input
                    type="checkbox"
                    v-model="bulkUpdateData.updateOrderingId"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
                  />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Update Order</span>
                </label>
                <input
                  v-if="bulkUpdateData.updateOrderingId"
                  v-model.number="bulkUpdateData.ordering_id"
                  type="number"
                  min="0"
                  placeholder="Enter order number"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </form>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="submitBulkUpdate" 
              :disabled="bulkUpdateSubmitting || (!bulkUpdateData.updateIsActive && !bulkUpdateData.updateOrderingId)"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ bulkUpdateSubmitting ? 'Updating...' : 'Update' }}
            </button>
            <button 
              @click="showBulkUpdateModal = false" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { getAuthHeaders } from '../../services/auth'
import Pagination from '../../components/common/Pagination.vue'
import FixedActions from '../../components/common/FixedActions.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

// State
const subStatuses = ref([])
const statuses = ref([])
const availableFlags = ref({
  status_flags: [],
  finance_flags: [],
  report_flags: [],
  warehouse_flags: []
})
const filterData = ref({
  statuses: [],
  flag_keys: {},
  flag_types: []
})
const loading = ref(false)
const showModal = ref(false)
const modalLoading = ref(false)
const showDeleteModal = ref(false)
const showBulkUpdateModal = ref(false)
const modalMode = ref('create')
const formSubmitting = ref(false)
const deleteSubmitting = ref(false)
const bulkUpdateSubmitting = ref(false)
const selectedSubStatusIds = ref([])
const selectedSubStatus = ref(null)
const error = ref(null)

// UI state for collapsible flag filters
const showFlagFilters = ref(false)

// Pagination state
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0,
  filtered_total: 0,
  this_page: 0,
  from: 0,
  to: 0
})

// State for filters
const filters = ref({
  search: '',
  status_id: '',
  is_active: '',
  flag_type: '',
  flag_key: '',
  flag_value: '',
  has_flag_key: '',
  page: 1,
  per_page: 20
})

// Form data
const formData = ref({
  name: '',
  code: '',
  status_id: '',
  is_active: true,
  ordering_id: null,
  flags: {
    status_flags: {},
    finance_flags: {},
    report_flags: {},
    warehouse_flags: {}
  }
})

// Bulk update data
const bulkUpdateData = ref({
  updateIsActive: false,
  updateOrderingId: false,
  is_active: true,
  ordering_id: null
})

// Fetch sub statuses with pagination and filters
const fetchSubStatuses = async () => {
  try {
    loading.value = true
    const headers = await getAuthHeaders()
    
    // Build query params
    const params = new URLSearchParams()
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.status_id) params.append('status_id', filters.value.status_id)
    if (filters.value.is_active !== '') params.append('is_active', filters.value.is_active)
    
    // Add flag filters
    if (filters.value.flag_type && filters.value.flag_key && filters.value.flag_value !== '') {
      params.append('flag_type', filters.value.flag_type)
      params.append('flag_key', filters.value.flag_key)
      params.append('flag_value', filters.value.flag_value)
    }
    if (filters.value.has_flag_key) {
      params.append('has_flag_key', filters.value.has_flag_key)
    }
    
    params.append('page', filters.value.page)
    params.append('per_page', filters.value.per_page)
    
    const response = await axios.get(`${API_URL}/sub-statuses/get?${params.toString()}`, { headers })
    
    if (response.data.success) {
      subStatuses.value = response.data.data
      
      // Update filter data if available
      if (response.data.filters) {
        filterData.value = response.data.filters
        // Update statuses for backward compatibility
        statuses.value = response.data.filters.statuses || []
      }
      
      // Update pagination
      pagination.value = {
        current_page: response.data.meta.current_page,
        last_page: response.data.meta.last_page,
        per_page: response.data.meta.per_page,
        total: response.data.meta.total,
        filtered_total: response.data.meta.filtered_total || response.data.meta.total,
        this_page: response.data.meta.this_page || response.data.meta.per_page,
        from: response.data.meta.from || ((response.data.meta.current_page - 1) * response.data.meta.per_page) + 1,
        to: response.data.meta.to || Math.min(response.data.meta.current_page * response.data.meta.per_page, response.data.meta.total)
      }
    }
  } catch (error) {
    console.error('Error fetching sub statuses:', error)
  } finally {
    loading.value = false
  }
}

// Fetch statuses for dropdown (now handled in fetchSubStatuses)
// This function is kept for backward compatibility but no longer used

// Change page
const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  filters.value.page = page
  fetchSubStatuses()
}

// Change items per page
const changePerPage = (perPage) => {
  filters.value.per_page = perPage
  filters.value.page = 1 // Reset to first page when changing items per page
  fetchSubStatuses()
}

// Apply filters
const applyFilters = () => {
  filters.value.page = 1 // Reset to first page when applying filters
  fetchSubStatuses()
}

// Reset filters
const resetFilters = () => {
  filters.value = {
    search: '',
    status_id: '',
    is_active: '',
    flag_type: '',
    flag_key: '',
    flag_value: '',
    has_flag_key: '',
    page: 1,
    per_page: 20
  }
  fetchSubStatuses()
}

// Computed property to check if any filters are active
const hasActiveFilters = computed(() => {
  return !!(
    filters.value.search ||
    filters.value.status_id ||
    filters.value.is_active ||
    filters.value.flag_type ||
    filters.value.flag_key ||
    filters.value.flag_value ||
    filters.value.has_flag_key
  )
})

// Toggle flag filters visibility
const toggleFlagFilters = () => {
  showFlagFilters.value = !showFlagFilters.value
}

// Clear only flag filters
const clearFlagFilters = () => {
  filters.value.flag_type = ''
  filters.value.flag_key = ''
  filters.value.flag_value = ''
  filters.value.has_flag_key = ''
}

// Format flag type name for display
const formatFlagTypeName = (flagType) => {
  const names = {
    'status_flags': 'Status Flags',
    'finance_flags': 'Finance Flags', 
    'report_flags': 'Report Flags',
    'warehouse_flags': 'Warehouse Flags'
  }
  return names[flagType] || flagType
}

// Get current flag keys based on selected flag type
const getCurrentFlagKeys = () => {
  if (!filters.value.flag_type || !filterData.value.flag_keys) {
    return []
  }
  return filterData.value.flag_keys[filters.value.flag_type] || []
}

// Handle flag type change in filters
const onFlagTypeChange = () => {
  // Reset dependent filters when flag type changes
  filters.value.flag_key = ''
  filters.value.flag_value = ''
}

// Get flags for a specific sub status and flag type
const getSubStatusFlags = (subStatus, flagType) => {
  // Check if the sub status has this flag type and it's not null
  if (!subStatus[flagType] || subStatus[flagType] === null) {
    return []
  }
  
  // If the flag data exists, parse it and return the enabled flags
  try {
    const flagData = typeof subStatus[flagType] === 'string' 
      ? JSON.parse(subStatus[flagType]) 
      : subStatus[flagType]
    
    if (!flagData || typeof flagData !== 'object') return []
    
    // Return only the keys that have truthy values
    return Object.keys(flagData)
      .filter(key => flagData[key])
      .map(key => ({ key, value: flagData[key] }))
  } catch (error) {
    console.error(`Error parsing ${flagType} for sub status ${subStatus.id}:`, error)
    return []
  }
}

// Fetch available flags for form (only when creating/editing)
const fetchAvailableFlags = async () => {
  try {
    const headers = await getAuthHeaders()
    
    // Fetch JSON field definitions for specific columns with comma-separated column_name
    const response = await axios.get(`${API_URL}/json-field-definitions`, {
      headers,
      params: {
        table_name: 'sub_statuses',
        column_name: 'status_flags,finance_flags,report_flags,warehouse_flags',
        per_page: 1000
      }
    })
    
    if (response.data.success) {
      // Group by column_name
      const flagTypes = ['status_flags', 'finance_flags', 'report_flags', 'warehouse_flags']
      
      flagTypes.forEach(flagType => {
        availableFlags.value[flagType] = response.data.data.filter(
          item => item.column_name === flagType
        )
      })
    }
  } catch (error) {
    console.error('Error fetching available flags:', error)
  }
}

// Initialize flag checkboxes based on available flags
const initializeFlags = () => {
  const flagTypes = ['status_flags', 'finance_flags', 'report_flags', 'warehouse_flags']
  
  flagTypes.forEach(flagType => {
    formData.value.flags[flagType] = {}
    availableFlags.value[flagType].forEach(flag => {
      formData.value.flags[flagType][flag.key] = false
    })
  })
}

// Load sub status flags when editing
const loadSubStatusFlags = (subStatus) => {
  // Reset flags
  initializeFlags()
  
  // Load actual flag values from the sub status
  const flagTypes = ['status_flags', 'finance_flags', 'report_flags', 'warehouse_flags']
  
  flagTypes.forEach(flagType => {
    if (subStatus[flagType] && subStatus[flagType] !== null) {
      try {
        const flagData = typeof subStatus[flagType] === 'string' 
          ? JSON.parse(subStatus[flagType]) 
          : subStatus[flagType]
        
        if (flagData && typeof flagData === 'object') {
          // Set the checkbox values based on the sub status data
          Object.keys(flagData).forEach(key => {
            if (formData.value.flags[flagType].hasOwnProperty(key)) {
              formData.value.flags[flagType][key] = Boolean(flagData[key])
            }
          })
        }
      } catch (error) {
        console.error(`Error parsing ${flagType} for sub status ${subStatus.id}:`, error)
      }
    }
  })
}

// Select all flags
const selectAllFlags = () => {
  const flagTypes = ['status_flags', 'finance_flags', 'report_flags', 'warehouse_flags']
  
  flagTypes.forEach(flagType => {
    if (availableFlags.value[flagType]) {
      availableFlags.value[flagType].forEach(flag => {
        if (formData.value.flags[flagType].hasOwnProperty(flag.key)) {
          formData.value.flags[flagType][flag.key] = true
        }
      })
    }
  })
}

// Clear all flags
const clearAllFlags = () => {
  const flagTypes = ['status_flags', 'finance_flags', 'report_flags', 'warehouse_flags']
  
  flagTypes.forEach(flagType => {
    if (formData.value.flags[flagType]) {
      Object.keys(formData.value.flags[flagType]).forEach(key => {
        formData.value.flags[flagType][key] = false
      })
    }
  })
}

// Open modal for create or edit
const openModal = async (mode, subStatus = null) => {
  modalMode.value = mode
  error.value = null
  showModal.value = true
  modalLoading.value = true
  
  try {
    // Fetch available flags for the form
    await fetchAvailableFlags()
    
    if (mode === 'edit' && subStatus) {
      selectedSubStatus.value = subStatus
      formData.value = {
        name: subStatus.name,
        code: subStatus.code,
        status_id: subStatus.status_id,
        is_active: subStatus.is_active,
        ordering_id: subStatus.ordering_id,
        flags: {
          status_flags: {},
          finance_flags: {},
          report_flags: {},
          warehouse_flags: {}
        }
      }
      loadSubStatusFlags(subStatus)
    } else {
      // Reset form for create mode
      formData.value = {
        name: '',
        code: '',
        status_id: '',
        is_active: true,
        ordering_id: null,
        flags: {
          status_flags: {},
          finance_flags: {},
          report_flags: {},
          warehouse_flags: {}
        }
      }
      initializeFlags()
    }
  } catch (error) {
    console.error('Error loading modal data:', error)
  } finally {
    modalLoading.value = false
  }
}

// Submit form (create or update)
const submitForm = async () => {
  try {
    formSubmitting.value = true
    const headers = await getAuthHeaders()
    
    let response
    
    if (modalMode.value === 'create') {
      response = await axios.post(`${API_URL}/sub-statuses/sub-status/create`, formData.value, { headers })
    } else {
      response = await axios.put(`${API_URL}/sub-statuses/sub-status/${selectedSubStatus.value.id}/update`, formData.value, { headers })
    }
    
    if (response.data.success) {
      showModal.value = false
      fetchSubStatuses() // Refresh the list
      
      // Show success toast
      if (modalMode.value === 'create') {
        toast.success(`Sub status "${formData.value.name}" created successfully!`)
      } else {
        toast.success(`Sub status "${formData.value.name}" updated successfully!`)
      }
    } else {
      error.value = response.data.message || 'An error occurred'
      toast.error(`❌ ${error.value}`)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    toast.error(`❌ ${error.value}`)
    console.error('Error submitting form:', err)
  } finally {
    formSubmitting.value = false
  }
}

// Confirm delete
const confirmDelete = (subStatus) => {
  selectedSubStatus.value = subStatus
  showDeleteModal.value = true
}

// Delete sub status
const deleteSubStatus = async () => {
  try {
    deleteSubmitting.value = true
    const headers = await getAuthHeaders()
    const statusName = selectedSubStatus.value.name
    
    const response = await axios.delete(`${API_URL}/sub-statuses/sub-status/${selectedSubStatus.value.id}/delete`, { headers })
    
    if (response.data.success) {
      showDeleteModal.value = false
      fetchSubStatuses() // Refresh the list
      toast.success(`🗑️ Sub status "${statusName}" deleted successfully!`)
    } else {
      const errorMsg = response.data.message || 'Failed to delete sub status'
      toast.error(`❌ ${errorMsg}`)
      console.error('Error deleting sub status:', errorMsg)
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'An error occurred while deleting'
    toast.error(`❌ ${errorMsg}`)
    console.error('Error deleting sub status:', err)
  } finally {
    deleteSubmitting.value = false
  }
}

// Toggle select all sub statuses
const toggleSelectAll = () => {
  if (selectedSubStatusIds.value.length === subStatuses.value.length) {
    selectedSubStatusIds.value = []
  } else {
    selectedSubStatusIds.value = subStatuses.value.map(subStatus => subStatus.id)
  }
}

// Open bulk update modal
const openBulkUpdateModal = () => {
  // Reset bulk update data
  bulkUpdateData.value = {
    updateIsActive: false,
    updateOrderingId: false,
    is_active: true,
    ordering_id: null
  }
  showBulkUpdateModal.value = true
}

// Submit bulk update
const submitBulkUpdate = async () => {
  try {
    bulkUpdateSubmitting.value = true
    const headers = await getAuthHeaders()
    
    // Build the payload according to the validation rules
    const payload = {
      sub_statuses: selectedSubStatusIds.value.map(id => {
        const updateItem = { id }
        
        if (bulkUpdateData.value.updateIsActive) {
          updateItem.is_active = bulkUpdateData.value.is_active
        }
        
        if (bulkUpdateData.value.updateOrderingId) {
          updateItem.ordering_id = bulkUpdateData.value.ordering_id
        }
        
        return updateItem
      })
    }
    
    const response = await axios.post(`${API_URL}/sub-statuses/bulk/update`, payload, { headers })
    
    if (response.data.success) {
      showBulkUpdateModal.value = false
      clearSelection()
      fetchSubStatuses() // Refresh the list
    } else {
      console.error('Error in bulk update:', response.data.message)
    }
  } catch (err) {
    console.error('Error in bulk update:', err)
  } finally {
    bulkUpdateSubmitting.value = false
  }
}

// Open bulk delete modal
const openBulkDeleteModal = () => {
  // Implement bulk delete functionality
  console.log('Bulk delete for IDs:', selectedSubStatusIds.value)
  // You can implement a confirmation modal for bulk deletion here
}

// Clear selected sub statuses
const clearSelection = () => {
  selectedSubStatusIds.value = []
}

// Fetch data on component mount
onMounted(() => {
  fetchSubStatuses()
})
</script>
