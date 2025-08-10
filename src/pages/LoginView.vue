<script setup>
import { ref } from 'vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import { useLoginForm } from '../composables/useLoginForm'

const {
  username,
  password,
  error,
  loading,
  handleLogin
} = useLoginForm()

const showPassword = ref(false)
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="absolute top-4 right-4">
      <ThemeToggle />
    </div>
    <div class="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div class="text-center">
        <img src="../assets/mgoods.png" alt="Mgoods ERP" class="mx-auto h-12 w-auto">
        <h2 class="text-xl text-gray-600 dark:text-gray-300 mb-8">MyCPA Admin by Mgoods ERP</h2>
      </div>
      
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div v-if="error" class="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
          {{ error }}
        </div>

        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input
            id="username"
            type="text"
            v-model="username"
            placeholder="Enter username"
            required
            :disabled="loading"
            class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <div class="relative">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Enter password"
              required
              :disabled="loading"
              class="mt-1 block w-full px-3 py-2 pr-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
            />
            <button
              type="button"
              tabindex="-1"
              class="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.956 9.956 0 012.197-6.223M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.269 2.943 9.542 7-.457 1.61-1.387 3.073-2.658 4.243M15.54 15.54A5.978 5.978 0 0112 17c-3.314 0-6-2.686-6-6" /></svg>
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Logging in...' : 'Log in to APP' }}
          </button>
        </div>

        <div class="text-center">
          <button
            type="button"
            :disabled="loading"
            class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium disabled:opacity-50"
          >
            Reset password
          </button>
        </div>
      </form>
    </div>
  </div>
</template>