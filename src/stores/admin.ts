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
  const postAdmins = async (ids: string[]) => {
    await apis.postAdmins(ids)
    admins.value = admins.value.concat(ids)
  }
  const deleteAdmins = async (ids: string[]) => {
    await apis.deleteAdmins(ids)
    admins.value = admins.value.filter(id => !ids.includes(id))
  }
  return {
    admins,
    isAdminFetched,
    fetchAdmins,
    postAdmins,
    deleteAdmins
  }
})
