import { defineStore } from 'pinia'
import { ref } from 'vue'

import apis from '/@/lib/apis'

export const useAdminStore = defineStore('admin', () => {
  const admins = ref<string[]>()
  const isAdminFetched = ref(false)

  const fetchAdmins = async () => {
    try {
      admins.value = (await apis.getAdmins()).data
      isAdminFetched.value = true
    } catch (err) {
      alert(err)
    }
  }
  return {
    admins,
    isAdminFetched,
    fetchAdmins
  }
})
