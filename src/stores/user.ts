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

  const isAdmin = (user: User | undefined) => {
    if (!user) return false
    return user.admin
  }
  const isAdminOrGroupOwner = (
    user: User | undefined,
    groupOwners: string[]
  ) => {
    if (!user) return false
    return user.admin || groupOwners.includes(user.name)
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
    isAdminOrGroupOwner,
    userOptions,
    isUserFetched,
    fetchMe,
    fetchUsers
  }
})
