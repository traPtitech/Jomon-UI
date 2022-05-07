<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import Button from './shared/Button.vue'
import Modal from './shared/Modal.vue'
import VueSelect from './shared/VueSelect.vue'
import { useGeneralStore } from '/@/stores/general'
import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'
import { useUserStore } from '/@/stores/user'

type Props = { requestId: string } //requestIdには申請の詳細画面からモーダルを表示するときだけpropsにIDを渡す。transaction一覧では空文字列を渡す
const props = defineProps<Props>()
const generalStore = useGeneralStore()
const requestDetailStore = useRequestDetailStore()
const transactionStore = useTransactionStore()
const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const { isModalOpen } = storeToRefs(generalStore)
const transaction = ref({
  amount: props.requestId ? requestDetailStore.request.amount : '',
  targets: props.requestId ? requestDetailStore.targetIds : ([] as string[]),
  requestId: props.requestId,
  tags: props.requestId ? requestDetailStore.tagIds : ([] as string[]),
  group: props.requestId ? requestDetailStore.request.group.id : null
})
function postTransaction() {
  if (
    /^[1-9][0-9]*$|^0$/.test(transaction.value.amount.toString()) &&
    transaction.value.targets.length > 0
  ) {
    //transactionStore.postTransaction(transaction.value)
    isModalOpen.value = false
  } else {
    alert('不正です')
  }
}
</script>

<template>
  <Modal :layer="1" size="md">
    <h1 class="text-3xl text-center mt-4 mb-4">入出金記録の新規作成</h1>
    <div class="flex flex-col justify-between ml-12 mr-12 h-4/5">
      <div class="text-xl">
        <span>紐づけられている申請：</span>
        <span v-if="requestId">{{ requestDetailStore.request.title }}</span>
        <span v-if="!requestId">なし</span>
      </div>
      <div class="mb-2">
        <span class="text-xl">金額：</span>
        <input v-model="transaction.amount" class="border border-gray-300" />円
      </div>
      <div class="mb-2">
        <span class="text-xl">払い戻し対象者：</span>
        <VueSelect
          v-model="transaction.targets"
          class="w-2/3 inline-block"
          :close-on-select="false"
          label="name"
          multiple
          :options="userStore.users"
          placeholder="払い戻し対象者"
          :reduce="(user:any) => user.name" />
      </div>
      <div class="mb-2">
        <span class="text-xl">グループ：</span>
        <VueSelect
          v-model="transaction.group"
          class="w-1/3 inline-block"
          label="name"
          :options="groupStore.groups"
          placeholder="グループ"
          :reduce="(group:any) => group.id" />
      </div>
      <div class="mb-2">
        <span class="text-xl">タグ：</span>
        <VueSelect
          v-model="transaction.tags"
          class="w-2/3 inline-block"
          :close-on-select="false"
          label="name"
          multiple
          :options="tagStore.tags"
          placeholder="タグ"
          :reduce="(tag:any) => tag.id" />
      </div>
      <div class="text-center">
        <Button
          class="w-64 mb-4"
          font-size="xl"
          padding="sm"
          @click.stop="postTransaction">
          入出金記録を作成する
        </Button>
      </div>
    </div>
  </Modal>
</template>
