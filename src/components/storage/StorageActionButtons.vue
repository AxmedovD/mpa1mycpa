<script setup>
import { useUser } from '../../services/user'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user } = useUser()

const isSuperAdmin = computed(() => user.value?.type === 'superadmin')
const isStorekeeper = computed(() => user.value?.type === 'storekeeper')
const isCashier = computed(() => user.value?.is_cashier)
const isCanIncomeByReason = computed(() => user.value?.can_income_by_reason)

const storekeeperActions = [
  { id: 'in', label: 'Kirim', color: 'green', route: '/storage/in' },
  { id: 'out', label: 'Chiqim', color: 'red', route: '/storage/out' }
]

const cashierActions = [
  { id: 'cash', label: 'Naqd kirim', color: 'green', route: '/storage/cashin' },
  { id: 'debt', label: 'Qarz kirim', color: 'blue', route: '/storage/debtin' }
]

const regularActions = [
  { id: 'in', label: 'Kirim', color: 'green', route: '/storage/in' },
  { id: 'out', label: 'Chiqim', color: 'red', route: '/storage/out' },
  { id: 'cash', label: 'Naqd kirim', color: 'green', route: '/storage/cashin' },
  { id: 'debt', label: 'Qarz kirim', color: 'blue', route: '/storage/debtin' },
  { id: 'return', label: 'Qaytarish', color: 'red', route: '/storage/debtout' }
]

const adminActions = [
  { id: 'enter', label: 'Enter', color: 'indigo', route: '/storage/enter' },
  { id: 'loss', label: 'Loss', color: 'orange', route: '/storage/loss' }
]

const actions = computed(() => {
  if (isSuperAdmin.value) {
    return [...regularActions, ...adminActions]
  }
  
  if (isStorekeeper.value) {
    if (isCashier.value && !isCanIncomeByReason.value) {
      return cashierActions // Show ONLY cash/debt buttons for cashier
    } else if (isCanIncomeByReason.value) {
      return storekeeperActions // Show ONLY in/out buttons for regular storekeeper
    } else {
      return storekeeperActions // Show all buttons for regular storekeeper
    }
  }
  
  return regularActions
})

const handleAction = (action) => {
  if (action.route) {
    router.push(action.route)
  } else {
    console.log('Action clicked:', action.id)
    // TODO: Implement other action handlers
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <button
      v-for="action in actions"
      :key="action.id"
      @click="handleAction(action)"
      :class="[
        'px-4 py-2 text-white rounded-lg transition-colors whitespace-nowrap',
        {
          'bg-green-600 hover:bg-green-700': action.color === 'green',
          'bg-blue-600 hover:bg-blue-700': action.color === 'blue',
          'bg-red-600 hover:bg-red-700': action.color === 'red',
          'bg-indigo-600 hover:bg-indigo-700': action.color === 'indigo',
          'bg-orange-600 hover:bg-orange-700': action.color === 'orange'
        }
      ]"
    >
      {{ action.label }}
    </button>
  </div>
</template>