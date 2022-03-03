import axios from 'axios'
import { defineStore } from 'pinia'

type Group = {
  id: string
  name: string
  description: string
  budget: number
  created_at: string
  updated_at: string
}
type Groups = {
  groups: Group[]
}
type GroupRequest = {
  name: string
  description: string
  budget: number
}
type Members = {
  members: string[]
}
type Member = {
  id: string
}
type Owners = {
  oweners: string[]
}

export const useGroupStore = defineStore('group', {
  state: () => ({
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
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Game',
        description: 'Game班',
        budget: 50000,
        created_at: '2022-01-27T14:06:32.381Z',
        updated_at: '2022-01-27T14:06:32.381Z'
      }
    ], //new Array<Group>()
    group: {} as Group,
    groupMembers: [
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      '3fa85f64-5717-4562-b3fc-2c963f66afa7',
      '3fa85f64-5717-4562-b3fc-2c963f66afa8',
      '3fa85f64-5717-4562-b3fc-2c963f66afa9',
      '3fa85f64-5717-4562-b3fc-2c963f66afa0'
    ], //new Array<string>()
    groupOwners: [
      '3fa85f64-5717-4562-b3fc-2c963f66afa7',
      '3fa85f64-5717-4562-b3fc-2c963f66afa9'
    ] //new Array<string>()
  }),
  getters: {
    groupsLength() {
      return () => this.groups.length
    },
    groupsFilter() {
      return (index: number) => {
        return this.groups.slice((index - 1) * 10, index * 10)
      }
    }
  },
  actions: {
    async getGroups() {
      const response: Groups = await axios.get('/api/groups')
      this.groups = response.groups
    },
    async postGroup(group: GroupRequest) {
      await axios.post('/api/groups', group)
      this.getGroups()
    },
    async putGroup(group: GroupRequest, id: string) {
      await axios.put('/api/groups' + id, group)
      this.getGroups()
    },
    async deleteGroup(id: string) {
      await axios.delete('/api/groups' + id)
      this.getGroups()
    },
    async getGroupMembers(id: string) {
      const response: Members = await axios.get('/api/groups' + id + '/members')
      this.groupMembers = response.members
    },
    async postGroupMember(id: string, member: Member) {
      await axios.post('/api/groups' + id + '/members', member)
      this.getGroupMembers(id)
    },
    async deleteGroupMember(id: string, member: Member) {
      await axios.delete('/api/groups' + id + '/members', { data: member })
      this.getGroupMembers(id)
    },
    async getGroupOwners(id: string) {
      const response: Owners = await axios.get('/api/groups' + id + '/owners')
      this.groupOwners = response.oweners
    },
    async postGroupOwner(id: string, owner: Member) {
      await axios.post('/api/groups' + id + '/owners', owner)
      this.getGroupOwners(id)
    },
    async deleteGroupOwner(id: string, owner: Member) {
      await axios.delete('/api/groups' + id + '/owners', { data: owner })
      this.getGroupOwners(id)
    }
  }
})
