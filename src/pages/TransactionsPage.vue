<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'

import { toPage } from '/@/lib/parseQueryParams'

import TransactionFilters from '/@/components/TransactionFilters.vue'
import TransactionItem from '/@/components/TransactionItem.vue'
import Button from '/@/components/shared/Button.vue'
import PaginationBar from '/@/components/shared/PaginationBar.vue'

const route = useRoute()
const page = ref(toPage(route.query.page))
const transactionStore = useTransactionStore()
const tagStore = useTagStore()

const sliceTransactionAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return transactionStore.transactions.slice(start, end)
}

onMounted(() => {
  transactionStore.fetchTransactions('created_at')
  tagStore.fetchTags()
})
</script>

<template>
  <div>
    <div class="min-w-160 mx-auto flex w-2/3 flex-col">
      <div class="relative flex w-full items-center justify-center py-8">
        <h1 class="text-center text-3xl">入出金記録</h1>
        <div class="absolute right-0">
          <Button font-size="lg" padding="md">新規レコード作成</Button>
        </div>
      </div>
      <div class="min-h-128">
        <TransactionFilters class="mb-2" />
        <ul class="divide-y">
          <li
            v-for="transaction in sliceTransactionAt(page, 10)"
            :key="transaction.id">
            <TransactionItem :transaction="transaction" />
          </li>
        </ul>
        <PaginationBar
          v-if="transactionStore.transactions.length > 0"
          class="my-4"
          :current-page="page"
          path="/transactions"
          :total-pages="Math.ceil(transactionStore.transactions.length / 10)" />
      </div>
    </div>
  </div>
</template>
