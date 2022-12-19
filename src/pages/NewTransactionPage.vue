<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import { toId } from '/@/lib/parseQueryParams'

import InputNumber from '/@/components/shared/InputNumber.vue'
import InputRadioButton from '/@/components/shared/InputRadioButton.vue'
import InputSelect from '/@/components/shared/InputSelect.vue'
import InputSelectTagWithCreation from '/@/components/shared/InputSelectTagWithCreation.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

import { useNewTransaction } from './composables/useNewTransaction'

const route = useRoute()
const requestId = toId(route.query.requestID) //requestIDには申請の詳細画面から新規作成ページに移動するときだけIDを渡す

const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const requestDetailStore = useRequestDetailStore()

const { request } = storeToRefs(requestDetailStore)
const { transaction, moneyDirection, postTransaction } =
  useNewTransaction(requestId)

const directionOptions = [
  {
    key: 'traPへ入金',
    value: 'toTraP'
  },
  {
    key: 'traPから出金',
    value: 'fromTraP'
  }
]

if (!groupStore.isGroupFetched) {
  await groupStore.fetchGroups()
}
if (!userStore.isUserFetched) {
  await userStore.fetchUsers()
}
if (!tagStore.isTagFetched) {
  await tagStore.fetchTags()
}
if (requestId !== '') {
  await requestDetailStore.fetchRequestDetail(requestId)
}
</script>

<template>
  <div v-if="!userStore.isAdmin()">権限がありません。</div>
  <div class="min-w-160 mx-auto flex w-2/3 flex-col px-12 pt-8">
    <div class="pb-8">
      <h1 class="text-center text-3xl">入出金記録の新規作成</h1>
    </div>
    <div class="flex flex-col gap-2">
      <div>
        紐づけられている申請：
        <span v-if="requestId && request">{{ request.title }}</span>
        <span v-if="!requestId">なし</span>
      </div>
      <div class="flex flex-col">
        <label>金額</label>
        <div>
          <InputNumber v-model="transaction.amount" class="mr-1" :min="1" />円
        </div>
      </div>
      <div class="flex flex-col">
        <label>入出金</label>
        <InputRadioButton
          v-model="moneyDirection"
          :options="directionOptions" />
      </div>
      <div class="flex flex-col">
        <label>取引相手</label>
        <InputSelect
          v-model="transaction.targets"
          class="!w-2/3"
          is-multiple
          :options="userStore.userOptions"
          placeholder="取引相手を選択" />
      </div>
      <div class="flex flex-col">
        <label>グループ</label>
        <InputSelect
          v-model="transaction.group"
          class="!w-2/3"
          :options="groupStore.groupOptions"
          placeholder="グループを選択" />
      </div>
      <div class="flex flex-col">
        <label>タグ</label>
        <InputSelectTagWithCreation v-model="transaction.tags" class="!w-2/3" />
      </div>
      <div class="text-right">
        <SimpleButton
          class="mb-4 w-64"
          font-size="xl"
          padding="sm"
          @click.stop="postTransaction">
          入出金記録を作成する
        </SimpleButton>
      </div>
    </div>
  </div>
</template>
