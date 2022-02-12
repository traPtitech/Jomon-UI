import axios from 'axios'
import { defineStore } from 'pinia'

type Tag = {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}
type TagRequest = {
  name: string
  description: string
}
type Group = {
  id: string
  name: string
  description: string
  budget: number
  created_at: string
  updated_at: string
}
type GroupRequest = {
  name: string
  description: string
  budget: number
}

export const useTagAndGroupStore = defineStore('tagAndGroup', {
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
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2021講習会',
        description: '2021年度講習会',
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      }
    ], //new Array<Tag>()
    groups: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'SysAd',
        description: 'SysAd班',
        budget: 250000,
        created_at: '2022-01-25T14:06:32.381Z',
        updated_at: '2022-01-25T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      }
    ] //new Array<Group>()
  }),
  actions: {
    async getTags() {
      const response: Tag[] = await axios.get('/api/tags')
      this.tags = response
    },
    async getGroups() {
      const response: Group[] = await axios.get('/api/groups')
      this.groups = response
    },
    async postTag(tag: TagRequest) {
      const response: Tag[] = await axios.post('/api/tags', tag)
      this.tags = response
    },
    async postGroup(group: GroupRequest) {
      const response: Group[] = await axios.post('/api/groups', group)
      this.tags = response
    },
    async putTag(tag: TagRequest, id: string) {
      const response: Tag[] = await axios.put('/api/tags/' + id, tag)
      this.tags = response
    },
    async putGroup(group: GroupRequest, id: string) {
      const response: Group[] = await axios.put('/api/groups' + id, group)
      this.tags = response
    },
    async deleteTag(id: string) {
      await axios.delete('/api/tags' + id)
    },
    async deleteGroup(id: string) {
      await axios.delete('/api/groups' + id)
    }
  }
})
