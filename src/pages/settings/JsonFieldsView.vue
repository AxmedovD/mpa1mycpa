<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-2">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">JSON Field Definitions</h1>
      <div class="flex gap-2">
        <button 
          @click="openModal('create')" 
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Single Field
        </button>
        <button 
          @click="openMultiModal()" 
          class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4l3 3m0 0l-3 3m3-3H3m13 4v1a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h4m6 6v1a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h4"></path>
          </svg>
          Bulk Add Fields
        </button>
      </div>
    </div>

    <!-- View Toggle -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 flex justify-end">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button 
          @click="currentView = 'card'" 
          type="button" 
          :class="[
            'px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-l-lg',
            currentView === 'card' 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700' 
              : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
          ]"
        >
          <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
          </svg>
          Card View
        </button>
        <button 
          @click="currentView = 'table'" 
          type="button" 
          :class="[
            'px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-r-lg',
            currentView === 'table' 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700' 
              : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
          ]"
        >
          <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2z"></path>
          </svg>
          Table View
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input
            id="search"
            v-model="filters.search"
            type="text"
            @keyup.enter="applyFilters"
            placeholder="Search by table, column, key..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="w-full md:w-48">
          <label for="table_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Table</label>
          <select
            id="table_name"
            v-model="filters.table_name"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Tables</option>
            <option v-for="table in uniqueTables" :key="table" :value="table">{{ table }}</option>
          </select>
        </div>
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

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <!-- No results -->
    <div v-else-if="jsonFields.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">No JSON field definitions found</p>
    </div>

    <!-- Card View: Tables on left, Fields on right -->
    <div v-else-if="currentView === 'card'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Tables List (Left Side) -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Database Tables</h2>
        <div class="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
          <div 
            v-for="table in uniqueTables" 
            :key="table"
            @click="selectTable(table)"
            :class="[
              'p-3 rounded-md cursor-pointer transition-all duration-200',
              selectedTable === table
                ? 'bg-indigo-100 dark:bg-indigo-900 border-l-4 border-indigo-500'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <div class="font-medium text-gray-900 dark:text-white">{{ table }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ getTableFieldCount(table) }} field{{ getTableFieldCount(table) !== 1 ? 's' : '' }}
            </div>
            <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {{ getTableColumns(table).join(', ') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Fields for Selected Table (Right Side) -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 lg:col-span-2">
        <div v-if="!selectedTable" class="flex flex-col items-center justify-center h-64">
          <svg class="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
          </svg>
          <p class="text-gray-500 dark:text-gray-400 text-center">Select a table from the left to view JSON field definitions</p>
        </div>

        <div v-else>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Fields for: {{ selectedTable }}</h2>
            <button 
              @click="createFieldForTable" 
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-3 rounded-md flex items-center text-sm"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Field
            </button>
          </div>

          <!-- Fields grouped by column -->
          <div v-if="getSelectedTableFields().length === 0" class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">No JSON field definitions found for this table</p>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="column in getTableColumns(selectedTable)" :key="column" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h3 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Column: {{ column }}
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div 
                  v-for="field in getColumnFields(selectedTable, column)" 
                  :key="field.id"
                  class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div class="font-medium text-sm text-gray-900 dark:text-white">{{ field.key }}</div>
                    <div class="flex space-x-1">
                      <button 
                        @click="openModal('edit', field)" 
                        class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button 
                        @click="confirmDelete(field)" 
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <span class="font-medium">Value:</span> {{ field.value }}
                  </div>
                  <div v-if="field.description" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ field.description }}
                  </div>
                  <div class="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    ID: {{ field.id }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table View -->
    <div v-else-if="currentView === 'table'" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="jsonFields.length > 0 && selectedFieldIds.length === jsonFields.length"
                  @change="toggleSelectAll"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Table</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Column</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Key</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="field in jsonFields" :key="field.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  v-model="selectedFieldIds"
                  :value="field.id"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">#{{ field.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                {{ field.table_name }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ field.column_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ field.key }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-[200px] truncate">{{ field.value }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-[200px] truncate">{{ field.description || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="openModal('edit', field)" 
                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
              >
                Edit
              </button>
              <button 
                @click="confirmDelete(field)" 
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <Pagination 
        v-if="!loading && jsonFields.length > 0" 
        :meta="pagination" 
        @page-change="changePage" 
        @per-page-change="changePerPage"
        class="mt-4"
      />
      
      <!-- Fixed Action Bar -->
      <FixedActions
        :selected-count="selectedFieldIds.length"
        :visible="selectedFieldIds.length > 0"
        @cancel="clearSelection"
      >
        <template #info>
          {{ selectedFieldIds.length }} {{ selectedFieldIds.length === 1 ? 'field' : 'fields' }} selected
        </template>
        <template #actions>
          <button 
            @click="openBulkDeleteModal"
            class="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded-md text-sm mr-2"
          >
            Delete
          </button>
        </template>
      </FixedActions>
    </div>

    <!-- JSON Field Form Modal -->
    <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="showModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              {{ modalMode === 'create' ? 'Add New JSON Field Definition' : 'Edit JSON Field Definition' }}
            </h3>
            
            <!-- Error message -->
            <div v-if="error" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4 mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
                </div>
              </div>
            </div>
            
            <form @submit.prevent="submitForm" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="table_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Table Name *</label>
                  <input
                    id="table_name"
                    v-model="formData.table_name"
                    type="text"
                    required
                    placeholder="e.g., users, orders, products"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label for="column_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Column Name *</label>
                  <input
                    id="column_name"
                    v-model="formData.column_name"
                    type="text"
                    required
                    placeholder="e.g., metadata, settings, config"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="key" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key *</label>
                  <input
                    id="key"
                    v-model="formData.key"
                    type="text"
                    required
                    placeholder="e.g., theme, language, notifications"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label for="value" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value *</label>
                  <input
                    id="value"
                    v-model="formData.value"
                    type="text"
                    required
                    placeholder="e.g., dark, en, true"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  rows="3"
                  placeholder="Optional description of this field definition..."
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="submitForm" 
              :disabled="formSubmitting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ formSubmitting ? 'Saving...' : 'Save' }}
            </button>
            <button 
              @click="showModal = false" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">Delete JSON Field Definition</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this JSON field definition? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="deleteField" 
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

    <!-- Multi-Create Modal -->
    <div v-if="showMultiModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="showMultiModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Bulk Add JSON Field Definitions
            </h3>
            
            <!-- Error message -->
            <div v-if="multiError" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4 mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-800 dark:text-red-200">{{ multiError }}</p>
                </div>
              </div>
            </div>
            
            <form @submit.prevent="submitMultiForm" class="space-y-6">
              <!-- Common Table and Column -->
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Common Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="multi_table_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Table Name *</label>
                    <input
                      id="multi_table_name"
                      v-model="multiFormData.table_name"
                      type="text"
                      required
                      placeholder="e.g., users, orders, products"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label for="multi_column_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Column Name *</label>
                    <input
                      id="multi_column_name"
                      v-model="multiFormData.column_name"
                      type="text"
                      required
                      placeholder="e.g., metadata, settings, config"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <!-- Dynamic Key-Value Pairs -->
              <div>
                <div class="flex justify-between items-center mb-3">
                  <h4 class="text-md font-medium text-gray-900 dark:text-white">Key-Value Definitions</h4>
                  <button
                    type="button"
                    @click="addDefinitionRow"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1 px-3 rounded-md text-sm flex items-center"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Row
                  </button>
                </div>
                
                <div class="space-y-3 max-h-96 overflow-y-auto">
                  <div 
                    v-for="(definition, index) in multiFormData.definitions" 
                    :key="index"
                    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                  >
                    <div class="flex justify-between items-start mb-3">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Definition {{ index + 1 }}</span>
                      <button
                        type="button"
                        @click="removeDefinitionRow(index)"
                        v-if="multiFormData.definitions.length > 1"
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label :for="`key_${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key *</label>
                        <input
                          :id="`key_${index}`"
                          v-model="definition.key"
                          type="text"
                          required
                          placeholder="e.g., theme, language, notifications"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label :for="`value_${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value *</label>
                        <input
                          :id="`value_${index}`"
                          v-model="definition.value"
                          type="text"
                          required
                          placeholder="e.g., dark, en, true"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div class="mt-3">
                      <label :for="`description_${index}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        :id="`description_${index}`"
                        v-model="definition.description"
                        rows="2"
                        placeholder="Optional description..."
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="submitMultiForm" 
              :disabled="multiFormSubmitting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ multiFormSubmitting ? 'Creating...' : `Create ${multiFormData.definitions.length} Definitions` }}
            </button>
            <button 
              @click="showMultiModal = false" 
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
import jsonFieldsService from '../../services/jsonFieldsService'
import Pagination from '../../components/common/Pagination.vue'
import FixedActions from '../../components/common/FixedActions.vue'

// State
const jsonFields = ref([])
const loading = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const showMultiModal = ref(false)
const modalMode = ref('create')
const formSubmitting = ref(false)
const deleteSubmitting = ref(false)
const multiFormSubmitting = ref(false)
const selectedFieldIds = ref([])
const selectedField = ref(null)
const selectedTable = ref(null)
const currentView = ref('table')
const error = ref(null)
const multiError = ref(null)

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
  table_name: '',
  page: 1,
  per_page: 20
})

// Form data
const formData = ref({
  table_name: '',
  column_name: '',
  key: '',
  value: '',
  description: ''
})

// Multi-create form data
const multiFormData = ref({
  table_name: '',
  column_name: '',
  definitions: [
    {
      key: '',
      value: '',
      description: ''
    }
  ]
})

// Computed property for unique tables
const uniqueTables = computed(() => {
  const tables = jsonFields.value.map(field => field.table_name)
  return [...new Set(tables)].sort()
})

// Helper functions for card view
const getTableFieldCount = (tableName) => {
  return jsonFields.value.filter(field => field.table_name === tableName).length
}

const getTableColumns = (tableName) => {
  const columns = jsonFields.value
    .filter(field => field.table_name === tableName)
    .map(field => field.column_name)
  return [...new Set(columns)].sort()
}

const getSelectedTableFields = () => {
  if (!selectedTable.value) return []
  return jsonFields.value.filter(field => field.table_name === selectedTable.value)
}

const getColumnFields = (tableName, columnName) => {
  return jsonFields.value.filter(field => 
    field.table_name === tableName && field.column_name === columnName
  )
}

// Fetch JSON fields with pagination and filters
const fetchJsonFields = async () => {
  try {
    loading.value = true
    
    const response = await jsonFieldsService.getAll(filters.value)
    
    if (response.success) {
      jsonFields.value = response.data
      
      // Update pagination
      pagination.value = {
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        per_page: response.meta.per_page,
        total: response.meta.total,
        filtered_total: response.meta.filtered_total || response.meta.total,
        this_page: response.meta.this_page || response.meta.per_page,
        from: response.meta.from || ((response.meta.current_page - 1) * response.meta.per_page) + 1,
        to: response.meta.to || Math.min(response.meta.current_page * response.meta.per_page, response.meta.total)
      }
    }
  } catch (error) {
    console.error('Error fetching JSON fields:', error)
    error.value = error.message || 'Failed to fetch JSON field definitions'
  } finally {
    loading.value = false
  }
}

// Change page
const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  filters.value.page = page
  fetchJsonFields()
}

// Change items per page
const changePerPage = (perPage) => {
  filters.value.per_page = perPage
  filters.value.page = 1
  fetchJsonFields()
}

// Apply filters
const applyFilters = () => {
  filters.value.page = 1
  fetchJsonFields()
}

// Reset filters
const resetFilters = () => {
  filters.value = {
    search: '',
    table_name: '',
    page: 1,
    per_page: 20
  }
  fetchJsonFields()
}

// Open modal for create or edit
const openModal = (mode, field = null) => {
  modalMode.value = mode
  error.value = null
  
  if (mode === 'edit' && field) {
    selectedField.value = field
    formData.value = {
      table_name: field.table_name,
      column_name: field.column_name,
      key: field.key,
      value: field.value,
      description: field.description || ''
    }
  } else {
    // Reset form for create mode, but preserve pre-filled values if any
    const currentTableName = formData.value.table_name
    const currentColumnName = formData.value.column_name
    
    formData.value = {
      table_name: currentTableName || '',
      column_name: currentColumnName || '',
      key: '',
      value: '',
      description: ''
    }
  }
  
  showModal.value = true
}

// Submit form (create or update)
const submitForm = async () => {
  try {
    formSubmitting.value = true
    
    // Validate form data
    const validation = jsonFieldsService.validateData(formData.value)
    if (!validation.isValid) {
      error.value = validation.errors.join(', ')
      return
    }
    
    let response
    
    if (modalMode.value === 'create') {
      response = await jsonFieldsService.create(formData.value)
    } else {
      response = await jsonFieldsService.update(selectedField.value.id, formData.value)
    }
    
    if (response.success) {
      showModal.value = false
      fetchJsonFields()
    } else {
      error.value = response.message || 'An error occurred'
    }
  } catch (err) {
    error.value = err.message || 'An error occurred'
    console.error('Error submitting form:', err)
  } finally {
    formSubmitting.value = false
  }
}

// Confirm delete
const confirmDelete = (field) => {
  selectedField.value = field
  showDeleteModal.value = true
}

// Delete field
const deleteField = async () => {
  try {
    deleteSubmitting.value = true
    
    const response = await jsonFieldsService.delete(selectedField.value.id)
    
    if (response.success) {
      showDeleteModal.value = false
      fetchJsonFields()
    } else {
      console.error('Error deleting field:', response.message)
      error.value = response.message || 'Failed to delete field'
    }
  } catch (err) {
    console.error('Error deleting field:', err)
    error.value = err.message || 'Failed to delete field'
  } finally {
    deleteSubmitting.value = false
  }
}

// Toggle select all fields
const toggleSelectAll = () => {
  if (selectedFieldIds.value.length === jsonFields.value.length) {
    selectedFieldIds.value = []
  } else {
    selectedFieldIds.value = jsonFields.value.map(field => field.id)
  }
}

// Open bulk delete modal
const openBulkDeleteModal = () => {
  console.log('Bulk delete for IDs:', selectedFieldIds.value)
}

// Clear selected fields
const clearSelection = () => {
  selectedFieldIds.value = []
}

// Card view functions
const selectTable = (tableName) => {
  selectedTable.value = tableName
}

const createFieldForTable = () => {
  if (selectedTable.value) {
    formData.value.table_name = selectedTable.value
    // Pre-fill with first column if available
    const columns = getTableColumns(selectedTable.value)
    if (columns.length > 0) {
      formData.value.column_name = columns[0]
    }
  }
  openModal('create')
}

// Open multi-create modal
const openMultiModal = () => {
  multiError.value = null
  
  // Pre-fill with selected table if in card view
  const tableName = selectedTable.value || ''
  const columnName = selectedTable.value ? getTableColumns(selectedTable.value)[0] || '' : ''
  
  multiFormData.value = {
    table_name: tableName,
    column_name: columnName,
    definitions: [
      {
        key: '',
        value: '',
        description: ''
      }
    ]
  }
  showMultiModal.value = true
}

// Add a new definition row
const addDefinitionRow = () => {
  multiFormData.value.definitions.push({
    key: '',
    value: '',
    description: ''
  })
}

// Remove a definition row
const removeDefinitionRow = (index) => {
  if (multiFormData.value.definitions.length > 1) {
    multiFormData.value.definitions.splice(index, 1)
  }
}

// Submit multi-create form
const submitMultiForm = async () => {
  try {
    multiFormSubmitting.value = true
    multiError.value = null
    
    // Validate common fields
    if (!multiFormData.value.table_name.trim()) {
      multiError.value = 'Table name is required'
      return
    }
    
    if (!multiFormData.value.column_name.trim()) {
      multiError.value = 'Column name is required'
      return
    }
    
    // Validate definitions
    const errors = []
    multiFormData.value.definitions.forEach((def, index) => {
      if (!def.key.trim()) {
        errors.push(`Key is required for definition ${index + 1}`)
      }
      if (!def.value.trim()) {
        errors.push(`Value is required for definition ${index + 1}`)
      }
    })
    
    if (errors.length > 0) {
      multiError.value = errors.join(', ')
      return
    }
    
    // Prepare data for API
    const requestData = {
      definitions: multiFormData.value.definitions.map(def => ({
        table_name: multiFormData.value.table_name,
        column_name: multiFormData.value.column_name,
        key: def.key,
        value: def.value,
        description: def.description || null
      }))
    }
    
    const response = await jsonFieldsService.bulkCreate(requestData)
    
    if (response.success) {
      showMultiModal.value = false
      fetchJsonFields()
    } else {
      multiError.value = response.message || 'An error occurred'
    }
  } catch (err) {
    multiError.value = err.message || 'An error occurred'
    console.error('Error submitting multi form:', err)
  } finally {
    multiFormSubmitting.value = false
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchJsonFields()
})
</script>
