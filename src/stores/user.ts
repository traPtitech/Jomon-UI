import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { User } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useUserStore = defineStore('user', () => {
  const me = ref<User>()
  const users = ref<User[]>()
  const isUserFetched = ref(false)

  const fetchMe = async () => {
    me.value = (await apis.getMe()).data
  }
  const fetchUsers = async () => {
    try {
      users.value = (await apis.getUsers()).data
      isUserFetched.value = true
    } catch (err) {
      alert(err)
    }
  }

  return {
    me,
    users,
    isUserFetched,
    fetchMe,
    fetchUsers
  }
})
