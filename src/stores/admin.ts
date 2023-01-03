import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useUserStore } from '/@/stores/user'

import apis from '/@/lib/apis'

export const useAdminStore = defineStore('admin', () => {
  const toast = useToast()
  const userStore = useUserStore()

  const admins = ref<string[]>()
  const isAdminFetched = ref(false)

  const adminOptions = computed(() => {
    return (
      admins.value?.map(admin => {
        return {
          key: userStore.userMap[admin],
          value: admin
        }
      }) ?? []
    )
  })

  const fetchAdmins = async () => {
    try {
      admins.value = (await apis.getAdmins()).data
      isAdminFetched.value = true
    } catch {
      toast.error('管理者の取得に失敗しました')
    }
  }

  return {
    admins,
    adminOptions,
    isAdminFetched,
    fetchAdmins
  }
})
