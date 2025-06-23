<script lang="ts" setup>
import type { Partition } from '/@/features/partition/model'
import router from '/@/router'

interface Props {
  page: number
  partitions: Partition[]
}
const props = defineProps<Props>()

const slicePartitionsAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return props.partitions.slice(start, end) ?? []
}

const navigateToPartition = (transactionId: string) => {
  router.push(`/partitions/${transactionId}`)
}
</script>

<template>
  <table
    class="table-auto border-collapse w-full overflow-x-scroll rounded-xl shadow">
    <thead>
      <tr>
        <th
          v-for="key in ['パーティション名', '予算']"
          :key="key"
          scope="col"
          class="px-1 py-4 text-left font-normal bg-surface-tertiary first:pl-6 first:rounded-ss-xl last:pr-6 last:rounded-se-xl">
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
        <td class="px-1 pl-6 py-4">
          {{ partition.name }}
        </td>
        <td class="px-1 pr-6 py-4">{{ partition.budget }}円</td>
      </tr>
    </tbody>
  </table>
</template>
