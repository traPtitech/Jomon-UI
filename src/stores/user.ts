import axios from 'axios'
import { defineStore } from 'pinia'

type User = {
  name: string
  display_name: string
  admin: boolean
  created_at: string
  updated_at: string
  deleted_at: string
}
type UserRequest = {
  name: string
  display_name: string
  admin: boolean
}

export const useUserStore = defineStore('users', {
  state: () => ({
    me: {
      name: 'mehm8128',
      display_name: 'mehm8128',
      admin: false,
      created_at: '2022-01-27T13:45:37.048Z',
      updated_at: '2022-01-27T13:45:37.048Z',
      deleted_at: '2022-01-27T13:45:37.048Z'
    }, //{} as User
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
    ] //new Array<User>()
  }),
  actions: {
    async getMe() {
      const response: User = await axios.get('/api/users/me')
      this.me = response
    },
    async getUsers() {
      const response: User[] = await axios.get('/api/users')
      this.users = response
    },
    async putUser(user: UserRequest) {
      await axios.put('/api/users', user)
    }
  }
})
