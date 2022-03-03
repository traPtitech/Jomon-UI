import axios from 'axios'
import { defineStore } from 'pinia'

import {
    Group, GroupResponse, GroupsResponse, Member, MembersResponse, OwnersResponse
} from '../types/groupTypes'

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
      }
    ], //new Array<GroupResponse>()
    group: {} as GroupResponse,
    groupMembers: new Array<Member>(),
    groupOwners: new Array<Member>()
  }),
  actions: {
    async getGroups() {
      const response: GroupsResponse = await axios.get('/api/groups')
      this.groups = response.groups
    },
    async postGroup(group: Group) {
      await axios.post('/api/groups', group)
      this.getGroups()
    },
    async putGroup(group: Group, id: string) {
      await axios.put('/api/groups' + id, group)
      this.getGroups()
    },
    async deleteGroup(id: string) {
      await axios.delete('/api/groups' + id)
      this.getGroups()
    },
    async getGroupMembers(id: string) {
      const response: MembersResponse = await axios.get(
        '/api/groups' + id + '/members'
      )
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
      const response: OwnersResponse = await axios.get(
        '/api/groups' + id + '/owners'
      )
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
