<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore, defaultParams } from '/@/stores/transaction'
import { useUserStore } from '/@/stores/user'

import { toId, toPage } from '/@/lib/parseQueryParams'

import PaginationBar from '/@/components/shared/PaginationBar.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import TransactionFilters from '/@/components/transactions/TransactionFilters.vue'
import TransactionItem from '/@/components/transactions/TransactionItem.vue'

const route = useRoute()
const page = ref(toPage(route.query.page))

const transactionStore = useTransactionStore()
const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()

const { transactions } = storeToRefs(transactionStore)

const sliceTransactionAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return transactions.value?.slice(start, end)
}

await transactionStore.fetchTransactions({
  ...defaultParams,
  group: toId(route.query.group),
  request: toId(route.query.requestID)
})

if (!groupStore.isGroupFetched) {
  await groupStore.fetchGroups()
}
if (!tagStore.isTagFetched) {
  await tagStore.fetchTags()
}

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
        <div v-if="userStore.isAdmin()" class="absolute right-0">
          <RouterLink to="/transactions/new">
            <SimpleButton font-size="lg" padding="md">
              新規入出金記録作成
            </SimpleButton>
          </RouterLink>
        </div>
      </div>
      <div class="min-h-128">
        <div class="mb-2">
          <span v-if="transactions && transactions.length !== 0">
            {{ transactions?.length }}件取得しました
          </span>
          <span v-else>条件に一致する申請は見つかりませんでした</span>
        </div>
        <TransactionFilters />
        <ul v-if="transactions" class="mt-2 divide-y">
          <li
            v-for="transaction in sliceTransactionAt(page, 10)"
            :key="transaction.id">
            <TransactionItem :transaction="transaction" />
          </li>
        </ul>
        <div v-else>loading...</div>
        <PaginationBar
          v-if="transactions && transactions.length > 0"
          class="my-4"
          :current-page="page"
          path="/transactions"
          :total-pages="Math.ceil(transactions.length / 10)" />
      </div>
    </div>
  </div>
</template>
