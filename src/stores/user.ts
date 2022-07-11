import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { User } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useUserStore = defineStore('user', () => {
  const me = ref<User>({
    name: 'mehm8128',
    display_name: 'mehm8128',
    admin: true,
    created_at: '2022-01-27T13:45:37.048Z',
    updated_at: '2022-01-27T13:45:37.048Z',
    deleted_at: '2022-01-27T13:45:37.048Z'
  })
  const users = ref<User[]>([
    {
      name: 'nagatech',
      display_name: 'ながてち',
      admin: true,
      created_at: '2022-01-25T13:45:37.048Z',
      updated_at: '2022-01-25T13:45:37.048Z',
      deleted_at: '2022-01-25T13:45:37.048Z'
    },
    {
      name: 'mehm8128',
      display_name: 'mehm8128',
      admin: true,
      created_at: '2022-01-27T13:45:37.048Z',
      updated_at: '2022-01-27T13:45:37.048Z',
      deleted_at: '2022-01-27T13:45:37.048Z'
    }
  ])
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
