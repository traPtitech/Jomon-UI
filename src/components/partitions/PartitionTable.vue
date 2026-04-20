<script lang="ts" setup>
import { computed } from 'vue'

import type { Partition } from '@/features/partition/entities'
import { isBudgetSet } from '@/features/partition/lib/isBudgetSet'
import { usePartitionStore } from '@/features/partition/store'
import { usePartitionGroupStore } from '@/features/partitionGroup/store'

const { partitions, isPartitionFetched, fetchPartitions } = usePartitionStore()
const { isPartitionGroupFetched, fetchPartitionGroups, partitionGroups } =
  usePartitionGroupStore()

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
</script>

<template>
  <table
    class="w-full table-auto border-collapse overflow-x-scroll rounded-xl shadow">
    <thead>
      <tr>
        <th
          v-for="name in [
            'パーティショングループ名',
            'パーティション名',
            '予算',
          ]"
          :key="name"
          scope="col"
          class="bg-surface-tertiary px-1 py-4 text-left font-normal first:rounded-ss-xl first:pl-6 last:rounded-se-xl last:pr-6">
          {{ name }}
        </th>
      </tr>
    </thead>

    <tbody>
      <template
        v-for="[
          groupId,
          groupedPartitions,
        ] in groupIdToGroupedPartitions.entries()"
        :key="groupId">
        <tr
          v-for="(partition, i) in groupedPartitions.partitions"
          :key="partition.id"
          :aria-label="`${groupedPartitions.group.name}の${partition.name}`"
          class="border-b">
          <td
            v-if="i === 0"
            :rowspan="groupedPartitions.partitions.length"
            class="px-1 py-4 pl-6">
            {{ groupedPartitions.group.name }}
          </td>
          <td class="px-1 py-4">
            {{ partition.name }}
          </td>
          <td class="px-1 py-4 pr-6">
            {{
              isBudgetSet(partition.budget)
                ? partition.budget + '円'
                : '指定なし'
            }}
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
