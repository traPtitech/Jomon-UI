import apis from '/@/lib/apis'

import { convertGroupDetailFromData, convertGroupFromData } from './converter'
import type { Group, GroupDetail, GroupSeed } from './model'

export const useGroupRepository = () => {
  return createGroupRepository()
}

const createGroupRepository = () => ({
  fetchGroups: async (): Promise<Group[]> => {
    const { data } = await apis.getGroups()

    return data.map(convertGroupFromData)
  },
  fetchGroup: async (id: string): Promise<GroupDetail> => {
    const { data } = await apis.getGroupDetail(id)

    return convertGroupDetailFromData(data)
  },
  createGroup: async (group: GroupSeed): Promise<Group> => {
    const groupData = {
      name: group.name,
      description: group.description,
      budget: group.budget
    }
    const { data } = await apis.postGroup(groupData)

    return convertGroupFromData(data)
  },
  editGroup: async (id: string, group: GroupSeed): Promise<Group> => {
    const groupData = {
      name: group.name,
      description: group.description,
      budget: group.budget
    }
    const { data } = await apis.putGroupDetail(id, groupData)

    return convertGroupFromData(data)
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
