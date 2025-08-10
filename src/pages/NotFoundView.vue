<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-6">Page not found</p>
    <router-link 
      to="/dashboard" 
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Return to Dashboard
    </router-link>
  </div>
</template>