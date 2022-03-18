import axios from 'axios'
import { defineStore } from 'pinia'

import { User, UserResponse } from '../types/userTypes'

export const useUserStore = defineStore('user', {
  state: () => ({
    me: {
      name: 'mehm8128',
      display_name: 'mehm8128',
      admin: true,
      created_at: '2022-01-27T13:45:37.048Z',
      updated_at: '2022-01-27T13:45:37.048Z',
      deleted_at: '2022-01-27T13:45:37.048Z'
    }, //{} as UserResponse
    users: [
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
        admin: false,
        created_at: '2022-01-27T13:45:37.048Z',
        updated_at: '2022-01-27T13:45:37.048Z',
        deleted_at: '2022-01-27T13:45:37.048Z'
      }
    ] //new Array<UserResponse>()
  }),
  actions: {
    async getMe() {
      const response: UserResponse = await axios.get('/api/users/me')
      this.me = response
    },
    async getUsers() {
      const response: UserResponse[] = await axios.get('/api/users')
      this.users = response
    },
    async putUser(user: User) {
      await axios.put('/api/users', user)
    }
  }
})
