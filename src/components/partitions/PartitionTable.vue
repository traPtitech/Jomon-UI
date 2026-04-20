<script lang="ts" setup>
import { computed } from 'vue'

import type { Partition } from '@/features/partition/entities'
import { isBudgetSet } from '@/features/partition/lib/isBudgetSet'
import { usePartitionStore } from '@/features/partition/store'
import { usePartitionGroupStore } from '@/features/partitionGroup/store'

const { partitions, isPartitionFetched, fetchPartitions } = usePartitionStore()
const { isPartitionGroupFetched, fetchPartitionGroups, idToPartitionGroup } =
  usePartitionGroupStore()

const partitionGroupIdToPartitions = computed(() => {
  const idToPartitions = new Map<string, Partition[]>()
  for (const partition of partitions.value) {
    const groupId = partition.parentPartitionGroupId
    const groupPartitions = idToPartitions.get(groupId)
    if (groupPartitions === undefined) {
      idToPartitions.set(groupId, [partition])
      continue
    }
    groupPartitions.push(partition)
  }
  return idToPartitions
})

if (!isPartitionGroupFetched.value) {
  await fetchPartitionGroups()
}
if (!isPartitionFetched.value) {
  await fetchPartitions()
}

const getPartitionGroupName = (groupId: string) => {
  return (
    idToPartitionGroup.value.get(groupId)?.name ??
    '不明なパーティショングループ'
  )
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
          groupPartitions,
        ] in partitionGroupIdToPartitions.entries()"
        :key="groupId">
        <tr
          v-for="(partition, i) in groupPartitions"
          :key="partition.id"
          :aria-label="`${getPartitionGroupName(groupId)}の${partition.name}`"
          class="border-b">
          <td
            v-if="i === 0"
            :rowspan="groupPartitions.length"
            class="px-1 py-4 pl-6">
            {{ getPartitionGroupName(groupId) }}
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
