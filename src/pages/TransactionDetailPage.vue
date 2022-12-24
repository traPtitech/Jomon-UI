<script lang="ts" setup>
import { ArrowLongRightIcon } from '@heroicons/vue/24/solid'
import { DateTime } from 'luxon/src/luxon'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import type { Transaction } from '/@/lib/apiTypes'
import type { PostTransactionWithOneTarget } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { formatDate } from '/@/lib/date'
import { toId } from '/@/lib/parsePathParams'

import SimpleButton from '/@/components/shared/SimpleButton.vue'
import TagsGroup from '/@/components/shared/TagsGroup.vue'
import EditTransactionForm from '/@/components/transactionDetail/EditTransactionForm.vue'

const route = useRoute()
const id = toId(route.params.id)

const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const toast = useToast()

const isEditMode = ref(false)

const transaction = ref<Transaction>()

const formattedDate = computed(() =>
  formatDate(transaction.value?.created_at ?? DateTime.fromISO(''))
)

const editedValue = ref<PostTransactionWithOneTarget>({
  amount: 0,
  target: '',
  request: '',
  tags: [],
  group: ''
})

const fetchTransaction = async (id: string) => {
  try {
    const response = (await apis.getTransactionDetail(id)).data
    transaction.value = {
      ...response,
      created_at: DateTime.fromISO(response.created_at),
      updated_at: DateTime.fromISO(response.updated_at)
    }

    editedValue.value = {
      amount: response.amount,
      target: response.target,
      request: response.request,
      tags: response.tags.map(tag => tag.id),
      group: response.group.id
    }
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
      <h1 class="text-3xl">取引記録の詳細</h1>
      <SimpleButton
        v-if="userStore.isAdmin() && transaction.request && !isEditMode"
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click="isEditMode = true">
        編集
      </SimpleButton>
    </div>
    <div v-if="!isEditMode" class="mb-4 space-y-2">
      <div>
        <p class="font-bold">年月日</p>
        <p>{{ formattedDate }}</p>
      </div>
      <div>
        <p class="font-bold">入出金</p>
        <div>
          <p>{{ Math.abs(transaction.amount) }}円</p>
          <div
            :class="`flex items-center gap-4 ${
              transaction.amount < 0
                ? 'flex-row-reverse justify-end'
                : 'flex-row'
            }`">
            traP
            <ArrowLongRightIcon class="w-8" />
            {{ transaction.target }}
          </div>
        </div>
      </div>
      <div>
        <p class="font-bold">取引グループ</p>
        <p>{{ transaction.group.name }}</p>
      </div>
      <div>
        <p class="font-bold">タグ</p>
        <div><TagsGroup :tags="transaction.tags" /></div>
      </div>
    </div>
    <EditTransactionForm
      v-else
      :transaction="transaction"
      @edited="handleEditTransaction" />
    <router-link class="w-fit" :to="`/requests/${transaction.request}`">
      <SimpleButton font-size="md" padding="sm">
        紐づいている申請へ移動
      </SimpleButton>
    </router-link>
  </div>
</template>
