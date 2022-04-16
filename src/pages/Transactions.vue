<script lang="ts" setup>
import { BookOpenIcon, PlusCircleIcon } from '@heroicons/vue/solid'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import FilteringTransactionMenu from '/@/components/FilteringTransactionMenu.vue'
import PaginationBar from '/@/components/PaginationBar.vue'
import Transaction from '/@/components/Transaction.vue'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'

const route = useRoute()
const pageIndex = Number(route.query.pageIndex)
const transactionStore = useTransactionStore()
const tagStore = useTagStore()

onMounted(() => {
  transactionStore.fetchTransactions('created_at')
  tagStore.fetchTags()
})
</script>

<template>
  <div v-if="true">aaaaaaaa</div>
  <div class="h-20 relative">
    <BookOpenIcon class="mt-4 ml-40 w-12" />
    <span class="font-bold top-6 text-2xl absolute">入出金記録</span>
    <PlusCircleIcon class="mt-10 mr-40 w-10 float-right" @click="() => {}" />
  </div>
  <div
    :class="
      pageIndex === Math.ceil(transactionStore.transactions.length / 13)
        ? 'h-123'
        : ''
    ">
    <div
      v-if="transactionStore.transactions.length !== 0"
      class="m-auto min-w-150 w-5/6">
      <FilteringTransactionMenu />
      <div class="border border-gray-400 border-1"></div>
      <ul>
        <li
          v-for="(transaction, index) in transactionStore.transactions"
          :key="transaction.id">
          <Transaction :index="index" />
        </li>
      </ul>
    </div>
    <div v-if="transactionStore.transactions.length !== 0" class="ml-30">
      {{ transactionStore.transactions.length }}件取得しました
    </div>
    <div v-else class="ml-30">条件に一致する申請は見つかりませんでした</div>
    <div class="mt-4">
      <PaginationBar
        :item-length="transactionStore.transactions.length"
        kind="transactions"
        :page-index="pageIndex"
        :unit="13" />
    </div>
  </div>
</template>
