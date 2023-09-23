import { DateTime } from 'luxon'

import apis from '/@/lib/apis'

import type { Group, GroupDetail, GroupSeed } from '/@/features/group/model'

export const useGroupRepository = () => {
  return createGroupRepository()
}

const createGroupRepository = () => ({
  fetchGroups: async (): Promise<Group[]> => {
    const { data } = await apis.getGroups()

    return data.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      budget: group.budget ?? 0,
      createdAt: DateTime.fromISO(group.created_at)
    }))
  },
  fetchGroup: async (id: string): Promise<GroupDetail> => {
    const { data } = await apis.getGroupDetail(id)

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      budget: data.budget ?? 0,
      createdAt: DateTime.fromISO(data.created_at),
      members: data.members,
      owners: data.owners
    }
  },
  createGroup: async (group: GroupSeed): Promise<Group> => {
    const groupData = {
      name: group.name,
      description: group.description,
      budget: group.budget
    }
    const { data } = await apis.postGroup(groupData)

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      budget: data.budget ?? 0,
      createdAt: DateTime.fromISO(data.created_at)
    }
  },
  editGroup: async (id: string, group: GroupSeed): Promise<Group> => {
    const groupData = {
      name: group.name,
      description: group.description,
      budget: group.budget
    }
    const { data } = await apis.putGroupDetail(id, groupData)

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      budget: data.budget ?? 0,
      createdAt: DateTime.fromISO(data.created_at)
    }
  },
  deleteGroup: async (id: string) => {
    await apis.deleteGroup(id)
  },
  postGroupMembers: async (id: string, members: string[]) => {
    const { data } = await apis.postGroupMembers(id, members)
    return data
  },
  deleteGroupMembers: async (id: string, members: string[]) => {
    await apis.deleteGroupMembers(id, members)
  },
  postGroupOwners: async (id: string, owners: string[]) => {
    const { data } = await apis.postGroupOwners(id, owners)
    return data
  },
  deleteGroupOwners: async (id: string, owners: string[]) => {
    await apis.deleteGroupOwners(id, owners)
  }
})
