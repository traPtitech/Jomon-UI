<script lang="ts" setup>
import type { Partition } from '/@/features/partiton/model'
import router from '/@/router'

interface Props {
  page: number
  partitons: Partition[]
}
const props = defineProps<Props>()

const slicePartitonsAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return props.partitons.slice(start, end) ?? []
}

const navigateToPartiton = (transactionId: string) => {
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
        v-for="partiton in slicePartitonsAt(props.page, 10)"
        :key="partiton.id"
        tabindex="0"
        :aria-label="'View details for ' + partiton.id"
        class="cursor-pointer border-b hover:bg-hover-secondary"
        @click="navigateToPartiton(partiton.id)"
        @keydown.enter="navigateToPartiton(partiton.id)"
        @keydown.space.stop="navigateToPartiton(partiton.id)">
        <td class="px-1 pl-6 py-4">
          {{ partiton.name }}
        </td>
        <td class="px-1 pr-6 py-4">{{ partiton.budget }}円</td>
      </tr>
    </tbody>
  </table>
</template>
