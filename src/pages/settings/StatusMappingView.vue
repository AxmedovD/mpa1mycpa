<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-2">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">Status Mappings</h1>
      <button 
        @click="openModal('create')" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Status Mapping
      </button>
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          Table View
        </button>
      </div>
    </div>
    
    <!-- Source Integration Filter -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="w-full md:w-64">
          <label for="source_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source Integration</label>
          <select
            id="source_id"
            v-model="filters.source_id"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option v-for="source in sourceIntegrations" :key="source.id" :value="source.id">{{ source.name }}</option>
          </select>
        </div>
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input
            id="search"
            v-model="filters.search"
            type="text"
            @keyup.enter="applyFilters"
            placeholder="Search by name..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="w-full md:w-48">
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
    <div v-else-if="sourceStatuses.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">No source statuses found</p>
    </div>

    <!-- Card View: Source statuses on left, mappings on right -->
    <div v-else-if="currentView === 'card'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Source Statuses List (Left Side) -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Source Statuses</h2>
        <div class="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
          <div 
            v-for="status in sourceStatuses" 
            :key="status.id"
            @click="selectSourceStatus(status)"
            :class="[
              'p-3 rounded-md cursor-pointer transition-all duration-200',
              selectedSourceStatus && selectedSourceStatus.id === status.id
                ? 'bg-indigo-100 dark:bg-indigo-900 border-l-4 border-indigo-500'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <div class="font-medium text-gray-900 dark:text-white">{{ status.name }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Code: {{ status.code }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">ID: {{ status.id }}</div>
          </div>
        </div>
      </div>

      <!-- Mappings for Selected Source Status (Right Side) -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 lg:col-span-2">
        <div v-if="!selectedSourceStatus" class="flex flex-col items-center justify-center h-64">
          <svg class="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
          </svg>
          <p class="text-gray-500 dark:text-gray-400 text-center">Select a source status from the left to view or create mappings</p>
        </div>

        <div v-else>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Mappings for: {{ selectedSourceStatus.name }}</h2>
            <button 
              @click="createMappingForSourceStatus" 
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-3 rounded-md flex items-center text-sm"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Mapping
            </button>
          </div>

          <!-- No mappings for selected source status -->
          <div v-if="filteredMappings.length === 0" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
            <p class="text-gray-500 dark:text-gray-400">No mappings found for this source status</p>
            <button 
              @click="createMappingForSourceStatus" 
              class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md inline-flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create First Mapping
            </button>
          </div>

          <!-- Mappings list -->
          <div v-else class="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
            <div 
              v-for="mapping in filteredMappings" 
              :key="mapping.id"
              class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">{{ mapping.name }}</h3>
                  <div class="mt-2 space-y-1">
                    <div class="text-sm">
                      <span class="text-gray-500 dark:text-gray-400">Status:</span> 
                      <span class="text-gray-900 dark:text-white">{{ mapping.status?.name || 'Not assigned' }}</span>
                    </div>
                    <div class="text-sm">
                      <span class="text-gray-500 dark:text-gray-400">Sub Status:</span> 
                      <span class="text-gray-900 dark:text-white">{{ mapping.sub_status?.name || 'Not assigned' }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span 
                    :class="mapping.is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'" 
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ mapping.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
              <div class="mt-4 flex justify-end space-x-2">
                <button 
                  @click="openModal('edit', mapping)" 
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button 
                  @click="confirmDelete(mapping)" 
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Table View: All source statuses and their mappings in a table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Source Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mapping</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sub Status</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="status in sourceStatuses" :key="status.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <!-- Source Status Info -->
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900 dark:text-white">{{ status.name }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ status.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ status.code }}</td>
              
              <!-- If no mappings exist for this source status -->
              <template v-if="!getSourceStatusMappings(status.id).length">
                <td colspan="4" class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center">
                    <span class="italic mr-2">No mappings</span>
                    <button 
                      @click="createMappingForSpecificStatus(status)" 
                      class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded"
                    >
                      Create Mapping
                    </button>
                  </div>
                </td>
                <td></td>
              </template>
              
              <!-- If mappings exist, show the first one inline -->
              <template v-else>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {{ getSourceStatusMappings(status.id)[0].name }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {{ getSourceStatusMappings(status.id)[0].status?.name || 'Not assigned' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {{ getSourceStatusMappings(status.id)[0].sub_status?.name || 'Not assigned' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span 
                    :class="getSourceStatusMappings(status.id)[0].is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'" 
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ getSourceStatusMappings(status.id)[0].is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <div class="flex justify-center space-x-2">
                    <button 
                      @click="openModal('edit', getSourceStatusMappings(status.id)[0])" 
                      class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                    >
                      Edit
                    </button>
                    <span class="text-gray-300">|</span>
                    <button 
                      @click="confirmDelete(getSourceStatusMappings(status.id)[0])" 
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </template>
            </tr>
            
            <!-- Additional rows for source statuses with multiple mappings -->
            <template v-for="status in sourceStatusesWithMultipleMappings" :key="`extra-${status.id}`">
              <tr v-for="(mapping, index) in getSourceStatusMappings(status.id).slice(1)" :key="mapping.id" class="bg-gray-50/50 dark:bg-gray-700/50">
                <td class="px-6 py-4 border-l-4 border-transparent"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {{ mapping.name }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {{ mapping.status?.name || 'Not assigned' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {{ mapping.sub_status?.name || 'Not assigned' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span 
                    :class="mapping.is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'" 
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ mapping.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <div class="flex justify-center space-x-2">
                    <button 
                      @click="openModal('edit', mapping)" 
                      class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                    >
                      Edit
                    </button>
                    <span class="text-gray-300">|</span>
                    <button 
                      @click="confirmDelete(mapping)" 
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Status Mapping Form Modal -->
    <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="showModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">{{ modalMode === 'create' ? 'Add New Status Mapping' : 'Edit Status Mapping' }}</h3>
            <form @submit.prevent="submitForm">
              <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  required
                  maxlength="255"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div class="mb-4">
                <label for="source_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source Integration</label>
                <select
                  id="source_id"
                  v-model="formData.source_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="" disabled>Select a source integration</option>
                  <option v-for="source in sourceIntegrations" :key="source.id" :value="source.id">{{ source.name }}</option>
                </select>
              </div>
              <div class="mb-4">
                <label for="source_status_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source Status</label>
                <select
                  id="source_status_id"
                  v-model="formData.source_status_id"
                  required
                  :disabled="!formData.source_id"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>{{ !formData.source_id ? 'Select source integration first' : 'Select a source status' }}</option>
                  <option v-for="sourceStatus in filteredSourceStatuses" :key="sourceStatus.id" :value="sourceStatus.id">{{ sourceStatus.name }}</option>
                </select>
              </div>
              <div class="mb-4">
                <label for="status_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <div class="relative">
                  <select
                    id="status_id"
                    v-model="formData.status_id"
                    :disabled="statusesLoading"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{{ statusesLoading ? 'Loading statuses...' : 'Select a status (optional)' }}</option>
                    <option v-for="status in statuses" :key="status.id" :value="status.id">{{ status.name }}</option>
                  </select>
                  <div v-if="statusesLoading" class="absolute right-3 top-2.5">
                    <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                </div>
                <p v-if="!statusesLoading && statuses.length === 0 && currentStatusTypeId" class="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  No statuses found for this source integration type
                </p>
              </div>
              <div class="mb-4">
                <label for="sub_status_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sub Status</label>
                <div class="relative">
                  <select
                    id="sub_status_id"
                    v-model="formData.sub_status_id"
                    :disabled="subStatusesLoading || !formData.status_id"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{{ !formData.status_id ? 'Select a status first' : subStatusesLoading ? 'Loading sub statuses...' : 'Select a sub status (optional)' }}</option>
                    <option v-for="subStatus in subStatuses" :key="subStatus.id" :value="subStatus.id">{{ subStatus.name }}</option>
                  </select>
                  <div v-if="subStatusesLoading" class="absolute right-3 top-2.5">
                    <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                </div>
                <p v-if="!subStatusesLoading && subStatuses.length === 0 && formData.status_id" class="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  No sub statuses found for this status
                </p>
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
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">Delete Status Mapping</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this status mapping? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="deleteStatusMapping" 
              :disabled="deleteSubmitting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ deleteSubmitting ? 'Deleting...' : 'Delete' }}
            </button>
            <button 
              @click="showDeleteModal = false" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { getAuthHeaders } from '../../services/auth'
import Pagination from '../../components/common/Pagination.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const statusMappings = ref([])
const sourceIntegrations = ref([])
const sourceStatuses = ref([])
const statuses = ref([])
const subStatuses = ref([])
const loading = ref(false)
const statusesLoading = ref(false)
const subStatusesLoading = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('create')
const formSubmitting = ref(false)
const deleteSubmitting = ref(false)
const selectedStatusMapping = ref(null)
const selectedSourceStatus = ref(null)
const selectedStatus = ref(null)
const currentStatusTypeId = ref(null)
const currentView = ref('card') // 'card' or 'table'
const error = ref(null)

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

// Filters with default source_id = 2
const filters = ref({
  search: '',
  is_active: '',
  source_id: 2, // Default source_id
  page: 1,
  per_page: 20
})

const formData = ref({
  name: '',
  source_id: 2, // Default to source_id 2
  source_status_id: '',
  status_id: '',
  sub_status_id: '',
  is_active: true
})

// Computed property to filter source statuses by selected source integration
const filteredSourceStatuses = computed(() => {
  if (!formData.value.source_id) {
    return []
  }
  return sourceStatuses.value.filter(status => status.source_id == formData.value.source_id)
})

// Computed property to filter mappings by selected source status
const filteredMappings = computed(() => {
  if (!selectedSourceStatus.value) {
    return []
  }
  return statusMappings.value.filter(mapping => mapping.source_status_id === selectedSourceStatus.value.id)
})

// Get the current source integration object
const currentSourceIntegration = computed(() => {
  if (!sourceIntegrations.value.length || !filters.value.source_id) return null
  return sourceIntegrations.value.find(source => source.id === filters.value.source_id)
})

// Helper method to get mappings for a specific source status
const getSourceStatusMappings = (sourceStatusId) => {
  return statusMappings.value.filter(mapping => mapping.source_status_id === sourceStatusId)
}

// Computed property to get source statuses with multiple mappings
const sourceStatusesWithMultipleMappings = computed(() => {
  return sourceStatuses.value.filter(status => {
    const mappingsCount = getSourceStatusMappings(status.id).length
    return mappingsCount > 1
  })
})

// Watch for source_id changes to reset selections and update status type ID
watch(() => filters.value.source_id, (newSourceId) => {
  // Reset selected source status when changing source integration
  selectedSourceStatus.value = null
  selectedStatus.value = null
  
  // Update the current status type ID from the selected source integration
  const sourceIntegration = sourceIntegrations.value.find(source => source.id === newSourceId)
  if (sourceIntegration && sourceIntegration.status_type_id) {
    currentStatusTypeId.value = sourceIntegration.status_type_id
    // Fetch statuses for this status type
    fetchStatuses(sourceIntegration.status_type_id)
  } else {
    currentStatusTypeId.value = null
    statuses.value = []
  }
  
  // Fetch source statuses for the new source integration
  fetchSourceStatuses()
})

// Watch for source_id changes in form to reset source_status_id
watch(() => formData.value.source_id, (newSourceId, oldSourceId) => {
  if (newSourceId !== oldSourceId) {
    formData.value.source_status_id = ''
    formData.value.status_id = ''
    formData.value.sub_status_id = ''
  }
})

// Watch for status_id changes to load sub-statuses
watch(() => formData.value.status_id, (newStatusId) => {
  if (newStatusId) {
    fetchSubStatuses(newStatusId)
  } else {
    subStatuses.value = []
  }
})

// Select a source status
const selectSourceStatus = (status) => {
  selectedSourceStatus.value = status
}

// Create a new mapping for the selected source status
const createMappingForSourceStatus = () => {
  if (!selectedSourceStatus.value) return
  
  formData.value = {
    name: `${selectedSourceStatus.value.name} Mapping`,
    source_id: selectedSourceStatus.value.source_id,
    source_status_id: selectedSourceStatus.value.id,
    status_id: '',
    sub_status_id: '',
    is_active: true
  }
  
  modalMode.value = 'create'
  showModal.value = true
}

// Create a new mapping for a specific source status (used in table view)
const createMappingForSpecificStatus = (status) => {
  formData.value = {
    name: `${status.name} Mapping`,
    source_id: status.source_id,
    source_status_id: status.id,
    status_id: '',
    sub_status_id: '',
    is_active: true
  }
  
  modalMode.value = 'create'
  showModal.value = true
}

const fetchStatusMappings = async () => {
  try {
    loading.value = true
    const headers = await getAuthHeaders()
    const params = new URLSearchParams()
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.is_active !== '') params.append('is_active', filters.value.is_active)
    if (filters.value.source_id) params.append('source_id', filters.value.source_id)
    params.append('page', filters.value.page)
    params.append('per_page', filters.value.per_page)
    
    const response = await axios.get(`${API_URL}/status-mappings/get?${params.toString()}`, { headers })
    
    if (response.data.success) {
      statusMappings.value = response.data.data
      
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
    console.error('Error fetching status mappings:', error)
  } finally {
    loading.value = false
  }
}

// Fetch source integrations for dropdown
const fetchSourceIntegrations = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.get(`${API_URL}/source-integrations/get`, { 
      headers,
      params: { per_page: 100 }
    })
    
    if (response.data.success) {
      sourceIntegrations.value = response.data.data
      
      // If we have source integrations and a default source_id
      if (sourceIntegrations.value.length && filters.value.source_id) {
        const sourceIntegration = sourceIntegrations.value.find(source => source.id === filters.value.source_id)
        if (sourceIntegration && sourceIntegration.status_type_id) {
          currentStatusTypeId.value = sourceIntegration.status_type_id
        }
      }
    }
  } catch (error) {
    console.error('Error fetching source integrations:', error)
    toast.error('Failed to load source integrations')
  }
}

// Fetch source statuses for dropdown
const fetchSourceStatuses = async () => {
  try {
    loading.value = true
    const headers = await getAuthHeaders()
    const params = new URLSearchParams()
    params.append('source_id', filters.value.source_id)
    params.append('per_page', 100)
    
    const response = await axios.get(`${API_URL}/source-statuses/get?${params.toString()}`, { headers })
    
    if (response.data.success) {
      sourceStatuses.value = response.data.data
      
      // If we have a source status with status_type_id, update it
      if (sourceStatuses.value.length > 0 && sourceStatuses.value[0].source_integration?.status_type_id) {
        currentStatusTypeId.value = sourceStatuses.value[0].source_integration.status_type_id
      }
    }
  } catch (error) {
    console.error('Error fetching source statuses:', error)
    toast.error('Failed to load source statuses')
  } finally {
    loading.value = false
  }
}

// Fetch statuses for dropdown based on type_id
const fetchStatuses = async (statusTypeId) => {
  try {
    if (!statusTypeId) return
    
    statusesLoading.value = true
    const headers = await getAuthHeaders()
    const params = new URLSearchParams()
    params.append('type_id', statusTypeId) // Changed from status_type_id to type_id
    params.append('is_active', true)
    params.append('per_page', 100)
    
    const response = await axios.get(`${API_URL}/statuses/get?${params.toString()}`, { headers })
    
    // Handle both success field and status field response formats
    if (response.data.success || response.data.status) {
      statuses.value = response.data.data || []
    }
  } catch (error) {
    console.error('Error fetching statuses:', error)
    toast.error('Failed to load statuses')
  } finally {
    statusesLoading.value = false
  }
}

// Fetch sub statuses for dropdown based on selected status
const fetchSubStatuses = async (statusId) => {
  try {
    if (!statusId) return
    
    subStatusesLoading.value = true
    const headers = await getAuthHeaders()
    const params = new URLSearchParams()
    params.append('status_id', statusId)
    params.append('is_active', true)
    params.append('per_page', 100)
    
    const response = await axios.get(`${API_URL}/sub-statuses/get?${params.toString()}`, { headers })
    
    // Handle both success field and status field response formats
    if (response.data.success || response.data.status) {
      subStatuses.value = response.data.data || []
    }
  } catch (error) {
    console.error('Error fetching sub statuses:', error)
    toast.error('Failed to load sub statuses')
  } finally {
    subStatusesLoading.value = false
  }
}

const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  filters.value.page = page
  fetchStatusMappings()
}

// Change items per page
const changePerPage = (perPage) => {
  filters.value.per_page = perPage
  filters.value.page = 1 // Reset to first page when changing items per page
  fetchStatusMappings()
}

const applyFilters = () => {
  filters.value.page = 1
  selectedSourceStatus.value = null // Reset selected source status when applying filters
  fetchSourceStatuses() // Fetch source statuses with the new filter
  fetchStatusMappings() // Fetch status mappings with the new filter
}

const resetFilters = () => {
  filters.value = {
    search: '',
    is_active: '',
    source_id: 2, // Keep default source_id
    page: 1,
    per_page: 20
  }
  selectedSourceStatus.value = null // Reset selected source status
  fetchSourceStatuses() // Fetch source statuses with reset filters
  fetchStatusMappings() // Fetch status mappings with reset filters
}

const openModal = (mode, mapping = null) => {
  modalMode.value = mode
  error.value = null
  
  // Reset sub-statuses when opening modal
  subStatuses.value = []
  
  if (mode === 'edit' && mapping) {
    selectedStatusMapping.value = mapping
    formData.value = {
      name: mapping.name,
      source_id: mapping.source_id,
      source_status_id: mapping.source_status_id,
      status_id: mapping.status_id,
      sub_status_id: mapping.sub_status_id,
      is_active: mapping.is_active
    }
    
    // When editing, fetch the sub-statuses for the selected status
    if (mapping.status_id) {
      fetchSubStatuses(mapping.status_id)
    }
  } else {
    // For create mode, pre-fill source_id from filters and source_status_id if selected
    formData.value = {
      name: selectedSourceStatus.value ? `${selectedSourceStatus.value.name} Mapping` : '',
      source_id: filters.value.source_id,
      source_status_id: selectedSourceStatus.value ? selectedSourceStatus.value.id : '',
      status_id: '',
      sub_status_id: '',
      is_active: true
    }
  }
  
  showModal.value = true
}

const submitForm = async () => {
  try {
    formSubmitting.value = true
    const headers = await getAuthHeaders()
    let response
    
    if (modalMode.value === 'create') {
      response = await axios.post(`${API_URL}/status-mappings/status-mapping/create`, formData.value, { headers })
    } else {
      response = await axios.put(`${API_URL}/status-mappings/status-mapping/${selectedStatusMapping.value.id}/update`, formData.value, { headers })
    }
    
    if (response.data.success) {
      showModal.value = false
      fetchStatusMappings()
      
      // Show success toast
      if (modalMode.value === 'create') {
        toast.success(`Status mapping "${formData.value.name}" created successfully!`)
      } else {
        toast.success(`Status mapping "${formData.value.name}" updated successfully!`)
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

const confirmDelete = (mapping) => {
  selectedStatusMapping.value = mapping
  showDeleteModal.value = true
}

const deleteStatusMapping = async () => {
  try {
    deleteSubmitting.value = true
    const headers = await getAuthHeaders()
    const mappingName = selectedStatusMapping.value.name
    
    const response = await axios.delete(`${API_URL}/status-mappings/status-mapping/${selectedStatusMapping.value.id}/delete`, { headers })
    
    if (response.data.success) {
      showDeleteModal.value = false
      fetchStatusMappings()
      toast.success(`Status mapping "${mappingName}" deleted successfully!`)
    } else {
      const errorMsg = response.data.message || 'Failed to delete status mapping'
      toast.error(`❌ ${errorMsg}`)
      console.error('Error deleting status mapping:', errorMsg)
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'An error occurred while deleting'
    toast.error(`❌ ${errorMsg}`)
    console.error('Error deleting status mapping:', err)
  } finally {
    deleteSubmitting.value = false
  }
}

onMounted(() => {
  // First fetch source integrations to get status_type_id
  fetchSourceIntegrations().then(() => {
    // Then fetch source statuses with default source_id=2
    fetchSourceStatuses()
    
    // Fetch status mappings with default source_id=2
    fetchStatusMappings()
    
    // If we have a status type ID from the source integration, fetch statuses
    if (currentStatusTypeId.value) {
      fetchStatuses(currentStatusTypeId.value)
    }
    
    // We don't fetch sub-statuses until a status is selected in the form
  })
})
</script>
