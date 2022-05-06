<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import TransactionFilters from '/@/components/TransactionFilters.vue'
import TransactionItem from '/@/components/TransactionItem.vue'
import Button from '/@/components/shared/Button.vue'
import PaginationBar from '/@/components/shared/PaginationBar.vue'
import { toPage } from '/@/lib/parseQueryParams'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'

const route = useRoute()
const page = ref(toPage(route.query.page))
const transactionStore = useTransactionStore()
const tagStore = useTagStore()

onMounted(() => {
  transactionStore.fetchTransactions('created_at')
  tagStore.fetchTags()
})
</script>

<template>
  <div>
    <div class="flex flex-col mx-auto min-w-160 w-2/3">
      <div class="flex w-full py-8 justify-center items-center relative">
        <h1 class="text-center text-3xl">入出金記録</h1>
        <div class="right-0 absolute">
          <Button font-size="lg" padding="md"> 新規レコード作成 </Button>
        </div>
      </div>
      <div class="min-h-128">
        <TransactionFilters class="mb-2" />
        <ul>
          <li
            v-for="(transaction, index) in transactionStore.transactions"
            :key="transaction.id">
            <TransactionItem :index="index" />
          </li>
        </ul>
        <div v-if="transactionStore.transactions.length !== 0">
          {{ transactionStore.transactions.length }}件取得しました
        </div>
        <div v-else class="ml-30">条件に一致する申請は見つかりませんでした</div>
        <PaginationBar
          class="my-4"
          :current-page="page"
          path="/transactions"
          :total-pages="Math.ceil(transactionStore.transactions.length / 13)" />
      </div>
    </div>
  </div>
</template>
