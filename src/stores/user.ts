import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { User } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useUserStore = defineStore('user', () => {
  const me = ref<User>({
    name: 'traP',
    display_name: 'traP',
    admin: false,
    created_at: '',
    updated_at: '',
    deleted_at: ''
  })
  const users = ref<User[]>()
  const isUserFetched = ref(false)
  const isMeFetched = ref(false)

  const fetchMe = async () => {
    try {
      me.value = (await apis.getMe()).data
      isMeFetched.value = true
    } catch (err: any) {
      alert(err.message)
    }
  }
  const fetchUsers = async () => {
    try {
      users.value = (await apis.getUsers()).data
      isUserFetched.value = true
    } catch (err: any) {
      alert(err.message)
    }
  }

  return {
    me,
    users,
    isUserFetched,
    isMeFetched,
    fetchMe,
    fetchUsers
  }
})
