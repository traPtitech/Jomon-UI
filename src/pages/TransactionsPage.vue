<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'

import { toPage } from '/@/lib/parseQueryParams'

import TransactionFilters from '/@/components/TransactionFilters.vue'
import TransactionItem from '/@/components/TransactionItem.vue'
import PaginationBar from '/@/components/shared/PaginationBar.vue'

import SimpleButton from '../components/shared/SimpleButton.vue'

const route = useRoute()
const page = ref(toPage(route.query.page))
const transactionStore = useTransactionStore()
const tagStore = useTagStore()

const sliceTransactionAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return transactionStore.transactions?.slice(start, end)
}

onMounted(() => {
  if (!transactionStore.isTransactionFetched) {
    transactionStore.fetchTransactions()
  }
  if (!tagStore.isTagFetched) {
    tagStore.fetchTags()
  }
})
watch(
  () => route.query.page,
  newPage => {
    page.value = toPage(newPage)
  }
)
</script>

<template>
  <div>
    <div class="min-w-160 mx-auto flex w-2/3 flex-col">
      <div class="relative flex w-full items-center justify-center pt-8 pb-4">
        <h1 class="text-center text-3xl">入出金記録</h1>
        <div class="absolute right-0">
          <router-link to="/transactions/new">
            <simple-button font-size="lg" padding="md">
              新規レコード作成
            </simple-button>
          </router-link>
        </div>
      </div>
      <div class="min-h-128">
        <div class="mb-2">
          <span
            v-if="
              transactionStore.transactions &&
              transactionStore.transactions.length !== 0
            ">
            {{ transactionStore.transactions?.length }}件取得しました
          </span>
          <span v-else>条件に一致する申請は見つかりませんでした</span>
        </div>
        <transaction-filters />
        <ul v-if="transactionStore.transactions" class="mt-2 divide-y">
          <li
            v-for="transaction in sliceTransactionAt(page, 10)"
            :key="transaction.id">
            <transaction-item :transaction="transaction" />
          </li>
        </ul>
        <div v-else>loading...</div>
        <pagination-bar
          v-if="
            transactionStore.transactions &&
            transactionStore.transactions.length > 0
          "
          class="my-4"
          :current-page="page"
          path="/transactions"
          :total-pages="Math.ceil(transactionStore.transactions.length / 10)" />
      </div>
    </div>
  </div>
</template>
