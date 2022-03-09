<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { BookOpenIcon, PlusCircleIcon } from '@heroicons/vue/solid'

import PaginationBar from '../components/PaginationBar.vue'
import Transaction from '../components/Transaction.vue'
import FilteringTransactionMenu from '../components/FilteringTransactionMenu.vue'
import { useTransactionStore } from '../stores/transaction'
import { useGroupStore } from '../stores/group'
import { useTagStore } from '../stores/tag'

const route = useRoute()
const pageIndex = Number(route.query.pageIndex)
const transactionStore = useTransactionStore()
const groupStore = useGroupStore()
const tagStore = useTagStore()
const { isModalOpen } = storeToRefs(transactionStore)

onMounted(() => {
  transactionStore.getTransactions()
  groupStore.getGroups()
  tagStore.getTags()
})
function changeIsModalOpen() {
  isModalOpen.value = !isModalOpen.value
}
</script>

<template>
  <div v-if="isModalOpen">aaaaaaaa</div>
  <div class="h-20 relative">
    <BookOpenIcon class="w-12 ml-40 mt-4" />
    <span class="font-bold text-2xl absolute top-6">入出金記録</span>
    <PlusCircleIcon
      class="w-10 float-right mr-40 mt-10"
      @click="changeIsModalOpen"
    />
  </div>
  <div
    :class="
      pageIndex === Math.ceil(transactionStore.transactionsLength() / 13)
        ? 'h-123'
        : ''
    "
  >
    <div
      v-if="transactionStore.transactionsLength() !== 0"
      class="min-w-150 w-5/6 m-auto"
    >
      <FilteringTransactionMenu />
      <div class="border border-gray-400 border-1"></div>
      <ul>
        <li
          v-for="(transaction, index) in transactionStore.transactionsFilter(
            pageIndex
          )"
          :key="transaction.id"
        >
          <Transaction :index="index" />
        </li>
      </ul>
    </div>
    <div v-if="transactionStore.transactionsLength() !== 0" class="ml-30">
      {{ transactionStore.transactionsLength() }}件取得しました
    </div>
    <div v-else class="ml-30">条件に一致する申請は見つかりませんでした</div>
    <div class="mt-4">
      <PaginationBar
        :itemLength="transactionStore.transactionsLength()"
        kind="transactions"
        :pageIndex="pageIndex"
        :unit="13"
      />
    </div>
  </div>
</template>
