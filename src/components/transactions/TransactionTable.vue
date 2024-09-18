<script lang="ts" setup>
import EditButton from '/@/components/shared/EditButton.vue'
import TagsGroup from '/@/components/shared/TagsGroup.vue'
import type { Transaction } from '/@/features/transaction/model'
import { formatDate } from '/@/lib/date'

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
    class="hidden md:grid grid-cols-[minmax(120px,1fr)_70px_repeat(2,minmax(120px,1fr))_3fr_50px] divide-y w-full overflow-x-scroll">
    <div
      class="grid grid-cols-subgrid col-span-6 bg-surface-tertiary gap-x-2 px-6 py-4">
      <div>年 月 日</div>
      <div>取引額</div>
      <div>取引相手</div>
      <div class="whitespace-nowrap">取引グループ</div>
      <div>タグ</div>
    </div>
    <router-link
      v-for="transaction in sliceTransactionAt(props.page, 10)"
      :key="transaction.id"
      class="grid grid-cols-subgrid col-span-6 hover:bg-hover-secondary gap-x-4 px-6 py-4"
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
      <div class="text-right">
        <EditButton class="w-6" />
      </div>
    </router-link>
  </div>
  <div class="md:hidden divide-y w-full overflow-x-scroll">
    <router-link
      v-for="transaction in sliceTransactionAt(props.page, 10)"
      :key="transaction.id"
      class="flex flex-col gap-y-2 hover:bg-hover-secondary px-6 py-4"
      :to="`transactions/${transaction.id}`">
      <div class="flex gap-4">
        <div class="truncate mr-auto">
          {{ transaction.group ? transaction.group.description : 'なし' }}
        </div>
        <div class="text-right">{{ transaction.amount }}円</div>
      </div>
      <div class="flex gap-4">
        <div class="mr-auto">
          {{ transaction.target }}
        </div>
        <div class="text-right">
          {{ formatDate(transaction.createdAt) }}
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-auto mr-auto">
          <TagsGroup :limit="3" :tags="transaction.tags" />
        </div>
        <div class="flex justify-end items-end">
          <EditButton class="w-4" />
        </div>
      </div>
    </router-link>
  </div>
</template>
