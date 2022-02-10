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

export const useUsersStore = defineStore('users', {
  state: () => ({
    me: {} as User,
    users: new Array<User>()
  }),
  getters: {},
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
      //const response: User = await axios.put('/api/users', user)
      await axios.put('/api/users', user)
    }
  }
})
