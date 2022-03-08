import axios from 'axios'
import { defineStore } from 'pinia'

import { Tag, TagResponse, TagsResponse } from '../types/tagTypes'

export const useTagStore = defineStore('tag', {
  state: () => ({
    tags: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2020講習会',
        description: '2020年度講習会',
        created_at: '2022-01-25T14:06:32.381Z',
        updated_at: '2022-01-25T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: '2021講習会',
        description: '2021年度講習会',
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      }
    ], //new Array<TagResponse>()
    tag: {} as TagResponse
  }),
  actions: {
    async getTags() {
      const response: TagsResponse = await axios.get('/api/tags')
      this.tags = response.tags
    },
    async getTag(id: string) {
      const response: TagResponse = await axios.get('/api/tags/' + id)
      this.tag = response
    },
    async postTag(tag: Tag) {
      await axios.post('/api/tags', tag)
      this.getTags()
    },
    async putTag(id: string, tag: Tag) {
      await axios.put('/api/tags/' + id, tag)
      this.getTags()
    },
    async deleteTag(id: string) {
      await axios.delete('/api/tags' + id)
      this.getTags()
    }
  }
})