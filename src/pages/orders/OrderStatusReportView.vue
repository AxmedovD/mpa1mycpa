<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Status Report</h1>
    
    <!-- Tab Navigation -->
    <div class="mb-6">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button 
            @click="activeTab = 'manager'" 
            class="py-4 px-1 border-b-2 font-medium text-sm" 
            :class="activeTab === 'manager' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
          >
            Manager Report
          </button>
          <button 
            @click="activeTab = 'source'" 
            class="py-4 px-1 border-b-2 font-medium text-sm" 
            :class="activeTab === 'source' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
          >
            Source Report
          </button>
        </nav>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-if="activeTab === 'manager'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manager</label>
          <input 
            type="text" 
            v-model="filters.manager" 
            placeholder="Filter by manager"
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            @keyup.enter="fetchReport"
          />
        </div>
        <div v-if="activeTab === 'source'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
          <input 
            type="text" 
            v-model="filters.source" 
            placeholder="Filter by source"
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            @keyup.enter="fetchReport"
          />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="preset in datePresets" 
              :key="preset.value"
              @click="activePreset = preset.value; applyDatePreset(preset.value)"
              :class="[
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                activePreset === preset.value 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              ]"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>
        <div v-if="activePreset === 'custom'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
          <input 
            type="date" 
            v-model="filters.start_date" 
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div v-if="activePreset === 'custom'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
          <input 
            type="date" 
            v-model="filters.end_date" 
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="flex items-end">
          <button 
            @click="fetchReport" 
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm mr-2"
          >
            Apply Filters
          </button>
          <button 
            @click="resetFilters" 
            class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md text-sm"
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
    
    
    <!-- Results table -->
    <div v-if="reports.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th @click="toggleSort(activeTab === 'manager' ? 'manager' : 'source')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center">
                  <span>{{ activeTab === 'manager' ? 'Manager' : 'Source' }}</span>
                  <span v-if="sortField === (activeTab === 'manager' ? 'manager' : 'source')" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('total_leads')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center">
                  <span>Total Leads</span>
                  <span v-if="sortField === 'total_leads'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th colspan="2" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div class="flex items-center justify-center">
                  <span>New</span>
                </div>
              </th>
              <th colspan="2" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div class="flex items-center justify-center">
                  <span>Approved</span>
                </div>
              </th>
              <th colspan="2" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div class="flex items-center justify-center">
                  <span>Delivering</span>
                </div>
              </th>
              <th colspan="2" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div class="flex items-center justify-center">
                  <span>Sold</span>
                </div>
              </th>
              <th colspan="2" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div class="flex items-center justify-center">
                  <span>Returned</span>
                </div>
              </th>
              <th colspan="2" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div class="flex items-center justify-center">
                  <span>Canceled</span>
                </div>
              </th>
            </tr>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
              <th @click="toggleSort('new.count')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center justify-center">
                  <span>Count</span>
                  <span v-if="sortField === 'new.count'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('new.percentage')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center justify-center">
                  <span>%</span>
                  <span v-if="sortField === 'new.percentage'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('approved.count')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center justify-center">
                  <span>Count</span>
                  <span v-if="sortField === 'approved.count'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('approved.percentage')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center justify-center">
                  <span>%</span>
                  <span v-if="sortField === 'approved.percentage'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('delivering.count')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center justify-center">
                  <span>Count</span>
                  <span v-if="sortField === 'delivering.count'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('delivering.percentage')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center justify-center">
                  <span>%</span>
                  <span v-if="sortField === 'delivering.percentage'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('sold.count')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center justify-center">
                  <span>Count</span>
                  <span v-if="sortField === 'sold.count'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('sold.percentage')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center justify-center">
                  <span>%</span>
                  <span v-if="sortField === 'sold.percentage'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('returned.count')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center justify-center">
                  <span>Count</span>
                  <span v-if="sortField === 'returned.count'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('returned.percentage')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center justify-center">
                  <span>%</span>
                  <span v-if="sortField === 'returned.percentage'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('canceled.count')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center justify-center">
                  <span>Count</span>
                  <span v-if="sortField === 'canceled.count'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
              <th @click="toggleSort('canceled.percentage')" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div class="flex items-center justify-center">
                  <span>%</span>
                  <span v-if="sortField === 'canceled.percentage'" class="ml-1">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(report, index) in sortedReports" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ activeTab === 'manager' ? report.manager : report.source }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ report.total_leads }}</td>
              
              <!-- New -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                {{ report.new.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(report.new.percentage)">
                {{ report.new.percentage }}%
              </td>
              
              <!-- Approved -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                {{ report.approved.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(report.approved.percentage)">
                {{ report.approved.percentage }}%
              </td>
              
              <!-- Delivering -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                {{ report.delivering.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(report.delivering.percentage)">
                {{ report.delivering.percentage }}%
              </td>
              
              <!-- Sold -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                {{ report.sold.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(report.sold.percentage)">
                {{ report.sold.percentage }}%
              </td>
              
              <!-- Returned -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                {{ report.returned.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(report.returned.percentage, true)">
                {{ report.returned.percentage }}%
              </td>
              
              <!-- Canceled -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                {{ report.canceled.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(report.canceled.percentage, true)">
                {{ report.canceled.percentage }}%
              </td>
            </tr>
          </tbody>
          <!-- Summary row if summary data is available -->
          <tfoot v-if="summary" class="bg-indigo-50 dark:bg-indigo-900 font-semibold border-t-2 border-indigo-200 dark:border-indigo-700">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700 dark:text-indigo-300">Summary</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700 dark:text-indigo-300">{{ summary.total_leads }}</td>
              
              <!-- New Summary -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700 dark:text-indigo-300 text-center">
                {{ summary.new.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(summary.new.percentage)">
                {{ summary.new.percentage }}%
              </td>
              
              <!-- Approved Summary -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700 dark:text-indigo-300 text-center">
                {{ summary.approved.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(summary.approved.percentage)">
                {{ summary.approved.percentage }}%
              </td>
              
              <!-- Delivering Summary -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700 dark:text-indigo-300 text-center">
                {{ summary.delivering.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(summary.delivering.percentage)">
                {{ summary.delivering.percentage }}%
              </td>
              
              <!-- Sold Summary -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700 dark:text-indigo-300 text-center">
                {{ summary.sold.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(summary.sold.percentage)">
                {{ summary.sold.percentage }}%
              </td>
              
              <!-- Returned Summary -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700 dark:text-indigo-300 text-center">
                {{ summary.returned.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(summary.returned.percentage, true)">
                {{ summary.returned.percentage }}%
              </td>
              
              <!-- Canceled Summary -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700 dark:text-indigo-300 text-center">
                {{ summary.canceled.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center" :class="getPercentageClass(summary.canceled.percentage, true)">
                {{ summary.canceled.percentage }}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    
    <!-- No results -->
    <div v-else-if="!loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">No reports found. Try adjusting your filters.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { getAuthHeaders } from '../../services/auth'

// State
const reports = ref([])
const summary = ref(null)
const loading = ref(false)
const error = ref(null)

// Tab state
const activeTab = ref('manager') // Default to manager tab

// Sorting state
const sortField = ref('total_leads')
const sortDirection = ref('desc')

// Date formatting helper function
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Get today's date in YYYY-MM-DD format
const now = new Date()
const today = formatDate(now)

// Date range presets
const datePresets = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: 'last7days' },
  { label: 'This week', value: 'thisweek' },
  { label: 'Last week', value: 'lastweek' },
  { label: 'This month', value: 'thismonth' },
  { label: 'Last month', value: 'lastmonth' },
  { label: 'Custom', value: 'custom' }
]

// Function to apply date preset
const applyDatePreset = (preset) => {
  const now = new Date()
  let startDate, endDate
  
  switch(preset) {
    case 'today':
      startDate = formatDate(now)
      endDate = formatDate(now)
      break
    case 'yesterday':
      const yesterday = new Date(now)
      yesterday.setDate(now.getDate() - 1)
      startDate = formatDate(yesterday)
      endDate = formatDate(yesterday)
      break
    case 'last7days':
      const sevenDaysAgo = new Date(now)
      sevenDaysAgo.setDate(now.getDate() - 6) // -6 because it includes today
      startDate = formatDate(sevenDaysAgo)
      endDate = formatDate(now)
      break
    case 'thisweek':
      const firstDayOfWeek = new Date(now)
      const day = now.getDay() || 7 // Convert Sunday (0) to 7
      firstDayOfWeek.setDate(now.getDate() - day + 1) // Monday is first day
      startDate = formatDate(firstDayOfWeek)
      endDate = formatDate(now)
      break
    case 'lastweek':
      const lastWeekStart = new Date(now)
      const lastWeekEnd = new Date(now)
      const currentDay = now.getDay() || 7
      lastWeekStart.setDate(now.getDate() - currentDay - 6) // Last Monday
      lastWeekEnd.setDate(now.getDate() - currentDay) // Last Sunday
      startDate = formatDate(lastWeekStart)
      endDate = formatDate(lastWeekEnd)
      break
    case 'thismonth':
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      startDate = formatDate(firstDayOfMonth)
      endDate = formatDate(now)
      break
    case 'lastmonth':
      const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      startDate = formatDate(firstDayOfLastMonth)
      endDate = formatDate(lastDayOfLastMonth)
      break
    default: // 'custom' or any other value
      return // Don't change dates for custom
  }
  
  filters.value.start_date = startDate
  filters.value.end_date = endDate
  
  // If not custom, fetch report immediately
  if (preset !== 'custom') {
    fetchReport()
  }
}

// Current active preset
const activePreset = ref('today')

// Filters
const filters = ref({
  manager: '',
  source: '',
  start_date: today,
  end_date: today,
  page: 1,
  per_page: 100
})

// Watch for tab changes and fetch the appropriate report
watch(activeTab, () => {
  fetchReport()
})

// Watch for date input changes to update preset to custom
watch([() => filters.value.start_date, () => filters.value.end_date], () => {
  // Only update if we're not already in the process of applying a preset
  // This prevents infinite loops when a preset itself updates the dates
  if (activePreset.value !== 'custom') {
    activePreset.value = 'custom'
  }
})

// Fetch report data
const fetchReport = async () => {
  try {
    loading.value = true
    const headers = await getAuthHeaders()
    
    // Build query params
    const params = new URLSearchParams()
    if (activeTab.value === 'manager' && filters.value.manager) {
      params.append('manager', filters.value.manager)
    }
    if (activeTab.value === 'source' && filters.value.source) {
      params.append('source', filters.value.source)
    }
    if (filters.value.start_date) params.append('start_date', filters.value.start_date)
    if (filters.value.end_date) params.append('end_date', filters.value.end_date)
    
    // Select the appropriate endpoint based on active tab
    const endpoint = activeTab.value === 'manager' 
      ? `${API_URL}/reports/orders/manager` 
      : `${API_URL}/reports/orders/source`
    
    const response = await axios.get(`${endpoint}?${params.toString()}`, { headers })
    
    if (response.data.status) {
      reports.value = response.data.data
      summary.value = response.data.summary
    } else {
      error.value = response.data.message || 'Failed to fetch report'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
    console.error('Error fetching report:', err)
  } finally {
    loading.value = false
  }
}

// Reset filters
const resetFilters = () => {
  filters.value = {
    manager: '',
    source: '',
    start_date: today,
    end_date: today,
    page: 1,
    per_page: 100
  }
  reports.value = []
  summary.value = null
  activePreset.value = 'today'
  fetchReport()
}

// Toggle sort field and direction
const toggleSort = (field) => {
  if (sortField.value === field) {
    // Toggle direction if clicking the same field
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new field and default to descending for counts
    sortField.value = field
    sortDirection.value = field.includes('count') ? 'desc' : 'asc'
  }
}

// Get color class based on percentage value
const getPercentageClass = (percentage, isNegative = false) => {
  if (isNegative) {
    // For metrics where lower is better (returned, canceled)
    if (percentage >= 30) return 'text-red-600 dark:text-red-400 font-bold'
    if (percentage >= 20) return 'text-orange-600 dark:text-orange-400'
    if (percentage >= 10) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  } else {
    // For metrics where higher is better (approved, sold)
    if (percentage >= 80) return 'text-green-600 dark:text-green-400 font-bold'
    if (percentage >= 60) return 'text-green-600 dark:text-green-400'
    if (percentage >= 40) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }
}

// Computed property for sorted reports
const sortedReports = computed(() => {
  if (!reports.value.length) return []
  
  return [...reports.value].sort((a, b) => {
    let aValue, bValue
    
    // Handle nested properties (e.g., 'approved.count')
    if (sortField.value.includes('.')) {
      const [parent, child] = sortField.value.split('.')
      aValue = a[parent][child]
      bValue = b[parent][child]
    } else {
      aValue = a[sortField.value]
      bValue = b[sortField.value]
    }
    
    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue)
      return sortDirection.value === 'asc' ? comparison : -comparison
    }
    
    // Handle number comparison
    if (sortDirection.value === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })
})

// Fetch data on component mount
onMounted(() => {
  fetchReport()
})
</script>
