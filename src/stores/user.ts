import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { User, PostUser } from '/@/lib/apis'
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
  const users = ref<User[]>([])

  const fetchMe = async () => {
    me.value = (await apis.usersMeGet()).data
  }
  const fetchUsers = async () => {
    users.value = (await apis.usersGet()).data
  }
  const putUser = async (user: PostUser) => {
    await apis.usersPut(user)
  }

  return { me, users, fetchMe, fetchUsers, putUser }
})
