import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { User } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useUserStore = defineStore('user', () => {
  const toast = useToast()

  const me = ref<User>()
  const users = ref<User[]>()
  const isUserFetched = ref(false)

  const isAdmin = () => {
    if (!me.value) return false
    return me.value.admin
  }

  const userOptions = computed(() => {
    return (
      users.value?.map(user => {
        return {
          key: user.name,
          value: user.name
        }
      }) ?? []
    )
  })

  const fetchMe = async () => {
    try {
      me.value = (await apis.getMe()).data
    } catch {
      toast.error('ユーザーの取得に失敗しました')
    }
  }
  const fetchUsers = async () => {
    try {
      users.value = (await apis.getUsers()).data
      isUserFetched.value = true
    } catch {
      toast.error('ユーザーの取得に失敗しました')
    }
  }

  return {
    me,
    users,
    isAdmin,
    userOptions,
    isUserFetched,
    fetchMe,
    fetchUsers
  }
})
