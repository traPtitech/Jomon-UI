import { defineStore } from 'pinia'
import { ref } from 'vue'

import apis from '/@/lib/apis'

export const useAdminStore = defineStore('admin', () => {
  const admins = ref<string[]>([])
  const isAdminFetched = ref(false)

  const fetchAdmins = async () => {
    admins.value = (await apis.getAdmins()).data
    isAdminFetched.value = true
  }
  return {
    admins,
    isAdminFetched,
    fetchAdmins
  }
})
