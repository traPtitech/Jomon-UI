import { defineStore } from 'pinia'
import { ref } from 'vue'

import apis from '/@/lib/apis'

export const useAdminStore = defineStore('admin', () => {
  // admins: ['mehm8128', 'mehm81', 'mehm']
  const admins = ref<string[]>([])
  const isAdminFetched = ref(false)

  const fetchAdmins = async () => {
    admins.value = (await apis.getAdmins()).data
  }
  const postAdmins = async (ids: string[]) => {
    await apis.postAdmins(ids)
  }
  const deleteAdmins = async (ids: string[]) => {
    await apis.deleteAdmins(ids)
  }
  return {
    admins,
    isAdminFetched,
    fetchAdmins,
    postAdmins,
    deleteAdmins
  }
})
