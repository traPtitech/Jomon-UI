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
  <div class="grid grid-cols-[1fr_100px_1fr_1fr_2fr_50px]">
    <div
      class="grid grid-cols-[subgrid] col-span-6 bg-surface-tertiary px-6 py-4">
      <div>年 月 日</div>
      <div>取引額</div>
      <div>取引相手</div>
      <div>取引グループ</div>
      <div>タグ</div>
    </div>
    <router-link
      v-for="transaction in sliceTransactionAt(props.page, 10)"
      :key="transaction.id"
      class="grid grid-cols-[subgrid] col-span-6 hover:bg-hover-secondary px-6 py-4"
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
      <div>
        <TagsGroup :limit="3" :tags="transaction.tags" />
      </div>
      <div>
        <PencilIcon></PencilIcon>
      </div>
    </router-link>
  </div>
</template>
