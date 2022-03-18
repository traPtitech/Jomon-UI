import axios from 'axios'
import { defineStore } from 'pinia'

import {
    Group, Group2, GroupResponse, GroupsResponse, Member, MembersResponse, OwnersResponse
} from '../types/groupTypes'

export const useGroupStore = defineStore('group', {
  state: () => ({
    groups: Array(95).fill({
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: 'SysAd',
      description:
        'traPの活動に必要な部内インフラの管理・開発を行います。メンバーの創作活動を支える重要な仕事です。また、技術や知識を身につけるために部内で勉強会を行ったり、webサービスを高速化する大会やトラブルシューティングの大会に出場したりもしています。',
      budget: 250000,
      created_at: '2022-01-25T14:06:32.381Z',
      updated_at: '2022-01-25T14:06:32.381Z'
    }), //new Array<GroupResponse>()
    group: {} as GroupResponse,
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
        return this.omitGroupDescription.slice((index - 1) * 10, index * 10)
      }
    },
    omitGroupDescription() {
      let returnGroups: GroupResponse[] = this.groups
      for (let i = 0; i < this.groups.length; i++) {
        if (returnGroups[i].description.length > 100) {
          returnGroups[i].description =
            returnGroups[i].description.slice(0, 100) + '...'
        }
      }
      return returnGroups
    }
  },
  actions: {
    async getGroups() {
      const response: GroupsResponse = await axios.get('/api/groups')
      this.groups = response.groups
    },
    async postGroup(group: Group2) {
      const willPostGroup = {
        name: group.name,
        description: group.description,
        budget: group.budget
      }
      const res: GroupResponse = await axios.post('/api/groups', willPostGroup)
      for (let i = 0; i < group.owners.length; i++) {
        this.postGroupOwner(res.id, { id: group.owners[i] })
      }
      for (let i = 0; i < group.members.length; i++) {
        this.postGroupMember(res.id, { id: group.members[i] })
      }
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
    async deleteGroupMember(id: string, memberId: string) {
      await axios.delete('/api/groups' + id + '/members' + memberId)
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
    async deleteGroupOwner(id: string, ownerId: string) {
      await axios.delete('/api/groups' + id + '/owners' + ownerId)
      this.getGroupOwners(id)
    }
  }
})
