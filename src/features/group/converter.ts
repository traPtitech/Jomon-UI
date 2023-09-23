import { DateTime } from 'luxon'

import type {
  Group as GroupData,
  GroupDetail as GroupDetailData
} from '/@/lib/apis'

import type { Group, GroupDetail } from '/@/features/group/model'

export const convertGroupFromData = (group: GroupData): Group => ({
  id: group.id,
  name: group.name,
  description: group.description,
  budget: group.budget ?? 0,
  createdAt: DateTime.fromISO(group.created_at)
})

export const convertGroupDetailFromData = (
  group: GroupDetailData
): GroupDetail => ({
  id: group.id,
  name: group.name,
  description: group.description,
  budget: group.budget ?? 0,
  createdAt: DateTime.fromISO(group.created_at),
  members: group.members,
  owners: group.owners
})
