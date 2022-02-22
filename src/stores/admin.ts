import axios from 'axios'
import { defineStore } from 'pinia'

type AdminRequest = {
  id: string
}

export const useAdminStore = defineStore('admin', {
  state: () => ({
    admins: ['mehm8128', 'mehm81', 'mehm'] //new Array<string>()
  }),
  actions: {
    async getAdmins() {
      const response: string[] = await axios.get('/api/admins')
      this.admins = response
    },
    async postAdmin(admin: AdminRequest) {
      await axios.post('/api/admins', admin)
    },
    async deleteAdmin(admin: string) {
      await axios.delete('/api/admins/' + admin)
    }
  }
})
