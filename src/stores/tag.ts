import axios from 'axios'
import { defineStore } from 'pinia'

import { TagResponse, TagsResponse } from '../types/tagTypes'

export const useTagStore = defineStore('tag', {
  state: () => ({
    tags: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa5',
        name: '2020講習会',
        created_at: '2020-02-12T08:01:37.838Z',
        updated_at: '2020-02-12T08:01:37.838Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2021講習会',
        created_at: '2021-02-12T08:01:37.838Z',
        updated_at: '2021-02-12T08:01:37.838Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: '2022講習会',
        created_at: '2022-02-12T08:01:37.838Z',
        updated_at: '2022-02-12T08:01:37.838Z'
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

    async deleteTag(id: string) {
      await axios.delete('/api/tags' + id)
      this.getTags()
    }
  }
})
