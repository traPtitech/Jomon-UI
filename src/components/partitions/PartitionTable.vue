<script lang="ts" setup>
import type { Partition } from '@/features/partition/entities'
import { isBudgetSet } from '@/features/partition/lib/isBudgetSet'
import { usePartitionGroupStore } from '@/features/partitionGroup/store'
import router from '@/router'

const { partitionGroupIdNameToMap } = usePartitionGroupStore()
interface Props {
  page: number
  partitions: Partition[]
}
const props = defineProps<Props>()

const slicePartitionsAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return props.partitions.slice(start, end)
}

const navigateToPartition = async (partitionId: string) => {
  await router.push(`/partitions/${partitionId}`)
}
</script>

<template>
  <table
    class="w-full table-auto border-collapse overflow-x-scroll rounded-xl shadow">
    <thead>
      <tr>
        <th
          v-for="key in [
            'パーティション名',
            'パーティショングループ名',
            '予算',
          ]"
          :key="key"
          scope="col"
          class="bg-surface-tertiary px-1 py-4 text-left font-normal first:rounded-ss-xl first:pl-6 last:rounded-se-xl last:pr-6">
          {{ key }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="partition in slicePartitionsAt(props.page, 10)"
        :key="partition.id"
        tabindex="0"
        :aria-label="'View details for ' + partition.id"
        class="cursor-pointer border-b hover:bg-hover-secondary"
        @click="navigateToPartition(partition.id)"
        @keydown.enter="navigateToPartition(partition.id)"
        @keydown.space.stop="navigateToPartition(partition.id)">
        <td class="px-1 py-4 pl-6">
          {{ partition.name }}
        </td>
        <td class="px-1 py-4">
          {{
            partitionGroupIdNameToMap.get(partition.parentPartitionGroupId) ??
            '不明なパーティショングループ'
          }}
        </td>
        <td class="px-1 py-4 pr-6">
          {{
            isBudgetSet(partition.budget) ? partition.budget + '円' : '指定なし'
          }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
