import { ref, onMounted } from 'vue'
import { fetchStorageFilters } from '../services/storage'

export function useStorageFilterData() {
  const users = ref([
    { value: '', label: 'All Users' }
  ])
  const stores = ref([
    { value: '', label: 'All Stores' }
  ])
  const kontragents = ref([
    { value: '', label: 'All Kontragents' }
  ])
  const loading = ref(true)
  const error = ref(null)

  const types = [
    { value: 'income', label: 'Kirim' },
    { value: 'outcome', label: 'Chiqim' },
    { value: 'enter', label: 'Enter' },
    { value: 'loss', label: 'Loss' }
  ]

  const loadFilterData = async () => {
    try {
      loading.value = true
      const data = await fetchStorageFilters()
      
      if (data.users?.length) {
        users.value = [
          { value: '', label: 'All Users' },
          ...data.users.map(user => ({
            value: user.id.toString(),
            label: user.name
          }))
        ]
      }

      if (data.stores?.length) {
        stores.value = [
          { value: '', label: 'All Stores' },
          ...data.stores.map(store => ({
            value: store.id.toString(),
            label: store.name
          }))
        ]
      }

      if (data.kontragents?.length) {
        kontragents.value = [
          { value: '', label: 'All Kontragents' },
          ...data.kontragents.map(k => ({
            value: k.id.toString(),
            label: k.name
          }))
        ]
      }
    } catch (err) {
      error.value = err.message
      console.error('Error loading filter data:', err)
    } finally {
      loading.value = false
    }
  }

  onMounted(loadFilterData)

  return {
    users,
    stores,
    kontragents,
    types,
    loading,
    error
  }
}