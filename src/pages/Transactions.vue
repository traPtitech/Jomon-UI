<script lang="ts" setup>
import { onMounted } from '@vue/runtime-core'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import Transaction from '../components/Transaction.vue'
// import NewTransactionModal from '../components/NewTransactionModal.vue'
import { useTransactionStore } from '../stores/transaction'

const route = useRoute()
const pageIndex = Number(route.query.pageIndex)
const transactionStore = useTransactionStore()
const { isModalOpen } = storeToRefs(transactionStore)
function changeIsModalOpen() {
  isModalOpen.value = !isModalOpen.value
}
</script>

<template>
  <!-- <NewTransactionModal v-if="isModalOpen" /> -->
  <div class="flex">
    <div class="font-bold text-2xl">入出金記録</div>
    <div>新規作成</div>
  </div>
  <div
    :class="
      pageIndex === Math.ceil(transactionStore.transactionsLength() / 10)
        ? 'h-123'
        : ''
    "
  >
    <div
      v-if="transactionStore.transactionsLength() !== 0"
      class="min-w-150 w-3/5 m-auto"
    >
      <div class="text-center flex">
        <div class="w-1/6">年 月 日</div>
        <div class="w-1/6">取引額</div>
        <div class="w-1/6">取引相手</div>
        <div class="w-1/6">取引グループ</div>
        <div class="w-1/3">タグ</div>
      </div>
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
  </div>
</template>
