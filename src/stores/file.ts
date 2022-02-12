import axios from 'axios'
import { defineStore } from 'pinia'

type File = {
  file: string
  name: string
}

export const useFileStore = defineStore('file', {
  state: () => ({
    files: new Array<File>()
  }),
  actions: {
    async getFile(ids: string[]) {
      for (let i = 0; i < ids.length; i++) {
        const response: File = await axios.get('/api/file/' + ids[i])
        this.files.concat(response)
      }
    },
    async deleteFile(id: string) {
      await axios.put('/api/file/' + id)
    }
  }
})
