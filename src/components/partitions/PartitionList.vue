<script lang="ts" setup>
import { computed } from 'vue'

import type { Partition } from '@/features/partition/entities'
import { usePartitionStore } from '@/features/partition/store'
import type { PartitionGroup } from '@/features/partitionGroup/entities'
import { usePartitionGroupStore } from '@/features/partitionGroup/store'
import { useUserStore } from '@/features/user/store'

import PartitionListGroupName from './PartitionListGroupName.vue'
import PartitionListPartitionBudget from './PartitionListPartitionBudget.vue'
import PartitionListPartitionManagement from './PartitionListPartitionManagement.vue'
import PartitionListPartitionName from './PartitionListPartitionName.vue'
import PartitionListParentPartitionGroupButton from './PartitionListParentPartitionGroupButton.vue'

const { partitions, isPartitionFetched, fetchPartitions, canEditPartition } =
  usePartitionStore()
const { isPartitionGroupFetched, fetchPartitionGroups, partitionGroups } =
  usePartitionGroupStore()
const { me, fetchMe, isMeFetched } = useUserStore()

interface GroupedPartitions {
  group: PartitionGroup
  partitions: Partition[]
}

const groupIdToGroupedPartitions = computed(() => {
  const idToGroupedPartitions = new Map(
    partitionGroups.value.map(group => [
      group.id,
      { group, partitions: [] as Partition[] },
    ])
  )

  for (const partition of partitions.value) {
    const groupedPartitions = idToGroupedPartitions.get(
      partition.parentPartitionGroupId
    )
    if (groupedPartitions === undefined) {
      idToGroupedPartitions.set(partition.parentPartitionGroupId, {
        group: {
          id: partition.parentPartitionGroupId,
          name: '不明なパーティショングループ',
          parentPartitionGroupId: null,
          depth: 1,
          createdAt: '',
          updatedAt: '',
        },
        partitions: [partition],
      })
      continue
    }
    groupedPartitions.partitions.push(partition)
  }

  return idToGroupedPartitions
})

if (!isPartitionGroupFetched.value) {
  await fetchPartitionGroups()
}
if (!isPartitionFetched.value) {
  await fetchPartitions()
}
if (!isMeFetched.value) {
  await fetchMe()
}

const userCanEditPartition = computed(() => canEditPartition.value(me.value))
const isEmptyGroupedPartitions = (groupedPartitions: GroupedPartitions) =>
  groupedPartitions.partitions.length === 0

// TODO: パーティションのグループ変更機能、グループ作成機能
</script>

<template>
  <div class="w-full divide-y rounded-xl border shadow">
    <template
      v-for="[
        groupId,
        groupedPartitions,
      ] in groupIdToGroupedPartitions.entries()"
      :key="groupId">
      <div
        v-if="
          userCanEditPartition ||
          groupedPartitions.partitions.some(
            partition => partition.management.state === 'available'
          )
        ">
        <div
          :class="`flex justify-between ${isEmptyGroupedPartitions(groupedPartitions) ? 'text-text-secondary' : ''}`">
          <PartitionListGroupName
            class="px-4 py-3"
            :partition-group="groupedPartitions.group" />
          <div
            v-if="isEmptyGroupedPartitions(groupedPartitions)"
            class="px-4 py-3">
            グループに属するパーティションがありません
          </div>
        </div>
        <div
          v-if="groupedPartitions.partitions.length !== 0"
          class="ml-12 divide-y rounded-tl-xl border-t border-l">
          <template
            v-for="partition in groupedPartitions.partitions"
            :key="partition.id">
            <div
              v-if="
                userCanEditPartition ||
                partition.management.state === 'available'
              "
              class="flex flex-col px-4 py-3 md:flex-row md:justify-between">
              <div class="flex items-center gap-1.5">
                <PartitionListPartitionName :partition="partition" />
                <PartitionListParentPartitionGroupButton
                  v-if="userCanEditPartition"
                  :partition="partition" />
              </div>
              <div
                class="flex items-center justify-between space-x-4 md:justify-end">
                <PartitionListPartitionBudget :partition="partition" />
                <PartitionListPartitionManagement
                  v-if="userCanEditPartition"
                  :partition="partition" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>
