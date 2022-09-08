<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import SimpleButton from '../components/shared/SimpleButton.vue'
import { toId } from '../lib/parseQueryParams'
import VueSelect from '/@/components/shared/VueSelect.vue'
import apis from '/@/lib/apis'
import { isAdmin } from '/@/lib/authorityCheck'
import { useGroupStore } from '/@/stores/group'
//多分idから再fetch
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

const route = useRoute()
const requestId = toId(route.query.requestID) //requestIDには申請の詳細画面から新規作成ページに移動するときだけIDを渡す

const requestDetailStore = useRequestDetailStore()
const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()

const hasAuthority = isAdmin(userStore.me)
const transaction = ref({
  amount:
    requestId && requestDetailStore.request
      ? requestDetailStore.request.amount
      : 0,
  targets: requestId ? requestDetailStore.targetIds : [],
  request: requestId,
  tags: requestId ? requestDetailStore.tagIds : [],
  group:
    requestId && requestDetailStore.request
      ? requestDetailStore.request.group.id
      : ''
})
async function postTransaction() {
  if (
    !/^[1-9][0-9]*$/.test(transaction.value.amount.toString()) ||
    transaction.value.targets.length === 0
  ) {
    alert('不正です')
    return
  }
  await apis.postTransaction(transaction.value)
}
</script>

<template>
  <div v-if="!hasAuthority">権限がありません。</div>
  <div class="min-w-160 mx-auto flex w-2/3 flex-col px-12 pt-8">
    <div class="pb-8">
      <h1 class="text-center text-3xl">入出金記録の新規作成</h1>
    </div>
    <div class="flex flex-col gap-2">
      <div>
        紐づけられている申請：
        <span v-if="requestId">{{ requestDetailStore.request!.title }}</span>
        <span v-if="!requestId">なし</span>
      </div>
      <div class="flex flex-col">
        <label>金額</label>
        <div>
          <input
            v-model="transaction.amount"
            class="rounded border border-gray-300" />円
        </div>
      </div>
      <div class="flex flex-col">
        <label>払い戻し対象者：</label>
        <vue-select
          v-model="transaction.targets"
          :close-on-select="false"
          label="name"
          multiple
          :options="userStore.users"
          placeholder="払い戻し対象者"
          :reduce="(user:any) => user.name" />
      </div>
      <div class="flex flex-col">
        <label>グループ：</label>
        <vue-select
          v-model="transaction.group"
          label="name"
          :options="groupStore.groups"
          placeholder="グループ"
          :reduce="(group:any) => group.id" />
      </div>
      <div class="flex flex-col">
        <label>タグ：</label>
        <vue-select
          v-model="transaction.tags"
          :close-on-select="false"
          label="name"
          multiple
          :options="tagStore.tags"
          placeholder="タグ"
          :reduce="(tag:any) => tag.id" />
      </div>
      <div class="text-right">
        <simple-button
          class="mb-4 w-64"
          font-size="xl"
          padding="sm"
          @click.stop="postTransaction">
          入出金記録を作成する
        </simple-button>
      </div>
    </div>
  </div>
</template>
