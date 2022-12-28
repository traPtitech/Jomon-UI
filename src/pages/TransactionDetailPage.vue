<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import type { Transaction } from '/@/lib/apiTypes'
import apis from '/@/lib/apis'
import { convertTransaction } from '/@/lib/date'
import { toId } from '/@/lib/parsePathParams'

import SimpleButton from '/@/components/shared/SimpleButton.vue'
import EditTransactionForm from '/@/components/transactionDetail/EditTransactionForm.vue'
import TransactionDetail from '/@/components/transactionDetail/TransactionDetail.vue'

const route = useRoute()
const id = toId(route.params.id)

const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const toast = useToast()

const isEditMode = ref(false)

const transaction = ref<Transaction>()

const fetchTransaction = async (id: string) => {
  try {
    const response = (await apis.getTransactionDetail(id)).data
    transaction.value = convertTransaction(response)
  } catch {
    toast.error('入出金記録の取得に失敗しました')
  }
}

function handleEditTransaction(editedTransaction: Transaction | undefined) {
  if (editedTransaction === undefined) {
    return
  }
  transaction.value = editedTransaction
  isEditMode.value = false
}

await fetchTransaction(id)
if (!userStore.isUserFetched) {
  await userStore.fetchUsers()
}
if (!tagStore.isTagFetched) {
  await tagStore.fetchTags()
}
if (!groupStore.isGroupFetched) {
  await groupStore.fetchGroups()
}
</script>

<template>
  <div
    v-if="transaction !== undefined"
    class="min-w-96 mx-auto h-full w-4/5 pt-4">
    <div class="flex items-center pb-4">
      <h1 class="text-3xl">入出金記録の詳細</h1>
      <SimpleButton
        v-if="userStore.isAdmin() && transaction.request && !isEditMode"
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click="isEditMode = true">
        編集
      </SimpleButton>
    </div>
    <TransactionDetail v-if="!isEditMode" :transaction="transaction" />
    <EditTransactionForm
      v-else
      :transaction="transaction"
      @edited="handleEditTransaction" />
    <RouterLink class="w-fit" :to="`/requests/${transaction.request}`">
      <SimpleButton font-size="md" padding="sm">
        紐づいている申請へ移動
      </SimpleButton>
    </RouterLink>
  </div>
</template>
