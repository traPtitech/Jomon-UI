<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import type { PostTransactionWithOneTarget, Transaction } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { isAdmin } from '/@/lib/authorityCheck'
import { formatDate } from '/@/lib/date'
import { toId } from '/@/lib/parsePathParams'

import FormInputNumber from '/@/components/shared/FormInputNumber.vue'
import FormSelect from '/@/components/shared/FormSelect.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import TagGroup from '/@/components/shared/TagGroup.vue'

const route = useRoute()
const id = toId(route.params.id)

const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()

const hasAuthority = isAdmin(userStore.me)
const isEditMode = ref(false)

const userOption = computed(() => {
  return (
    userStore.users?.map(user => {
      return {
        key: user.name,
        value: user.name
      }
    }) ?? []
  )
})
const tagOption = computed(() => {
  return (
    tagStore.tags?.map(tag => {
      return {
        key: tag.name,
        value: tag.id
      }
    }) ?? []
  )
})
const groupOption = computed(() => {
  return (
    groupStore.groups?.map(group => {
      return {
        key: group.name,
        value: group.id
      }
    }) ?? []
  )
})

const transaction = ref<Transaction>({
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  amount: 1200,
  target: 'mehm8128',
  request: 'c2cd9bd7-a4e9-4dbd-a26a-5dbb063a7ae7',
  tags: [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: '2020講習会',
      created_at: '2022-01-25T14:06:32.381Z',
      updated_at: '2022-01-25T14:06:32.381Z'
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
      name: '2021講習会',
      created_at: '2022-01-27T14:06:32.381Z',
      updated_at: '2022-01-27T14:06:32.381Z'
    }
  ],
  group: {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'SysAd',
    description: 'SysAd班',
    budget: 250000,
    created_at: '2022-04-05T14:02:15.431Z',
    updated_at: '2022-04-05T14:02:15.431Z'
  },
  created_at: '2022-02-09T14:03:53.278Z',
  updated_at: '2022-02-09T14:03:53.278Z'
})

const editedValue = ref<PostTransactionWithOneTarget>({
  amount: transaction.value.amount,
  target: transaction.value.target,
  request: transaction.value.request,
  tags: transaction.value.tags.map(tag => tag.id),
  group: transaction.value.group.id
})

async function handlePutTransaction() {
  try {
    const res = (await apis.putTransactionDetail(id, editedValue.value)).data
    transaction.value = res
  } catch (e) {
    alert(e)
  } finally {
    editedValue.value = {
      amount: transaction.value.amount,
      target: transaction.value.target,
      request: transaction.value.request,
      tags: transaction.value.tags.map(tag => tag.id),
      group: transaction.value.group.id
    }
    isEditMode.value = false
  }
}

const fetchTransaction = async (id: string) => {
  try {
    transaction.value = (await apis.getTransactionDetail(id)).data
  } catch {
    alert('エラー')
  }
}

onMounted(async () => {
  await fetchTransaction(id)
  if (!userStore.isUserFetched) {
    await userStore.fetchUsers()
  }
})
</script>

<template>
  <div
    v-if="transaction !== undefined"
    class="min-w-96 mx-auto h-full w-4/5 pt-4">
    <div class="flex items-center pb-4">
      <h1 class="text-3xl">取引記録の詳細</h1>
      <SimpleButton
        v-if="hasAuthority && !transaction.request && !isEditMode"
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click="isEditMode = true">
        編集
      </SimpleButton>
    </div>
    <ul v-if="!isEditMode" class="mb-4 space-y-2">
      <li>年月日： {{ formatDate(transaction.created_at) }}</li>
      <li>取引額： {{ transaction.amount }}円</li>
      <li>取引相手： {{ transaction.target }}</li>
      <li>取引グループ： {{ transaction.group.name }}</li>
      <li>タグ：<TagGroup :tags="transaction.tags" /></li>
    </ul>
    <form v-else class="mb-4 space-y-2">
      <div>年月日：{{ formatDate(transaction.created_at) }}</div>
      <div>
        取引額：
        <FormInputNumber
          v-model="editedValue.amount"
          :min="1"
          placeholder="金額" />円
      </div>
      <div>
        取引相手：
        <FormSelect
          v-model="editedValue.target"
          :options="userOption"
          placeholder="取引相手を選択" />
      </div>
      <div>
        取引グループ：
        <FormSelect
          v-model="editedValue.group"
          :options="groupOption"
          placeholder="グループを選択" />
      </div>
      <div>
        タグ：
        <FormSelect
          v-model="editedValue.tags"
          is-multiple
          :options="tagOption"
          placeholder="タグを選択" />
      </div>
      <div class="text-right">
        <SimpleButton
          font-size="sm"
          padding="sm"
          @click.prevent="handlePutTransaction">
          完了
        </SimpleButton>
      </div>
    </form>
    <router-link class="w-fit" :to="`/requests/${transaction.request}`">
      <SimpleButton font-size="md" padding="sm">
        紐づいている申請へ移動
      </SimpleButton>
    </router-link>
  </div>
</template>
