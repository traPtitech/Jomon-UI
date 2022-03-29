<script lang="ts" setup>
import { ref } from 'vue'

import { useGroupStore } from '../stores/group'
import { useRequestDetailStore } from '../stores/requestDetail'
import { useTagStore } from '../stores/tag'
import { useTransactionStore } from '../stores/transaction'
import { useUserStore } from '../stores/user'
import { TransactionRequest } from '../types/transactionTypes'
import VueSelect from './VueSelect.vue'

type Props = { request_id: string } //request_idには申請の詳細画面からモーダルを表示するときだけpropsにIDを渡す。transaction一覧では空文字列を渡す
const props = defineProps<Props>()

const requestDetailStore = useRequestDetailStore()
const transactionStore = useTransactionStore()
const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()

const transaction = ref({
  amount: props.request_id ? requestDetailStore.request.amount : '',
  targets: props.request_id ? requestDetailStore.targetIds : ([] as string[]),
  request_id: props.request_id,
  tags: props.request_id ? requestDetailStore.tagIds : ([] as string[]),
  group: props.request_id ? requestDetailStore.request.group.id : null
} as TransactionRequest)

function postTransaction() {
  if (
    /^[1-9][0-9]*$|^0$/.test(transaction.value.amount.toString()) &&
    transaction.value.targets.length > 0
  ) {
    transactionStore.postTransaction(transaction.value)
  } else {
    alert('金額が不正です')
  }
}
</script>

<template>
  <div
    class="bg-white w-280 h-140 absolute z-3 inset-0 m-auto overflow-y-scroll"
  >
    <h1 class="text-3xl text-center mt-4 mb-4">入出金記録の新規作成</h1>

    <div class="flex flex-col justify-between ml-12 h-4/5">
      <div class="text-xl">
        <span>紐づけられている申請：</span>
        <span v-if="request_id">{{ requestDetailStore.request.title }}</span>
        <span v-if="!request_id">なし</span>
      </div>
      <div class="mb-2">
        <span class="text-xl">金額：</span>
        <input
          v-model="transaction.amount"
          class="border border-solid border-black"
        />円
      </div>
      <div class="mb-2">
        <span class="text-xl">払い戻し対象者：</span>
        <VueSelect
          v-model="transaction.targets"
          :options="userStore.users"
          :reduce="(user:any) => user.name"
          label="name"
          placeholder="払い戻し対象者"
          multiple
          :closeOnSelect="false"
          class="w-2/3 inline-block"
        ></VueSelect>
      </div>
      <div class="mb-2">
        <span class="text-xl">グループ：</span>
        <VueSelect
          v-model="transaction.group"
          :options="groupStore.groups"
          :reduce="(group:any) => group.id"
          label="name"
          placeholder="グループ"
          class="w-1/3 inline-block"
        ></VueSelect>
      </div>
      <div class="mb-2">
        <span class="text-xl">タグ：</span>
        <VueSelect
          v-model="transaction.tags"
          :options="tagStore.tags"
          :reduce="(tag:any) => tag.id"
          label="name"
          placeholder="タグ"
          multiple
          :closeOnSelect="false"
          class="w-2/3 inline-block"
        ></VueSelect>
      </div>
      <div class="text-center">
        <button @click="postTransaction" class="w-64 text-xl mb-4">
          入出金記録を作成する
        </button>
      </div>
    </div>
  </div>
</template>
