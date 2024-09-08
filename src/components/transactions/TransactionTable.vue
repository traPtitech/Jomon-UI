<script lang="ts" setup>
import TagsGroup from '/@/components/shared/TagsGroup.vue'
import type { Transaction } from '/@/features/transaction/model'
import { formatDate } from '/@/lib/date'
import { PencilIcon } from '@heroicons/vue/24/solid'

interface Props {
  page: number
  transactions: Transaction[]
}
const props = defineProps<Props>()

const sliceTransactionAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return props.transactions.slice(start, end)
}
</script>

<template>
  <div
    class="grid grid-cols-[repeat(4,minmax(100px,1fr))_2fr_50px] divide-y w-full overflow-x-scroll">
    <div
      class="grid grid-cols-[subgrid] col-span-6 bg-surface-tertiary gap-x-[1vw] pl-[1vw] py-4">
      <div>年 月 日</div>
      <div>取引額</div>
      <div>取引相手</div>
      <div class="whitespace-nowrap">取引グループ</div>
      <div>タグ</div>
    </div>
    <router-link
      v-for="transaction in sliceTransactionAt(props.page, 10)"
      :key="transaction.id"
      class="grid grid-cols-[subgrid] col-span-6 hover:bg-hover-secondary gap-x-[1vw] pl-[1vw] py-4"
      :to="`transactions/${transaction.id}`">
      <div>
        {{ formatDate(transaction.createdAt) }}
      </div>
      <div>{{ transaction.amount }}円</div>
      <div>
        {{ transaction.target }}
      </div>
      <div class="truncate">
        {{ transaction.group ? transaction.group.description : 'なし' }}
      </div>
      <TagsGroup :limit="3" :tags="transaction.tags" />
      <PencilIcon class="w-6" />
    </router-link>
  </div>
</template>
