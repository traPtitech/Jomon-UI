import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useUserStore } from '/@/stores/user'

export const useAdminStore = defineStore('admin', () => {
  const userStore = useUserStore()
  const { userMap } = storeToRefs(userStore)

  const admins = ref<string[]>([])
  const isAdminFetched = ref(false)

  const adminOptions = computed(() =>
    admins.value.map(admin => ({
      key: userMap.value[admin],
      value: admin
    }))
  )

  return {
    admins,
    adminOptions,
    isAdminFetched
  }
})
