<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import apis from '/@/lib/apis'
import { toId } from '/@/lib/parseQueryParams'

import FormInputNumber from '/@/components/shared/FormInputNumber.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'

const route = useRoute()
const requestId = toId(route.query.requestID) //requestIDには申請の詳細画面から新規作成ページに移動するときだけIDを渡す

const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const requestDetailStore = useRequestDetailStore()
const toast = useToast()

const { request, targetIds, tagIds } = storeToRefs(requestDetailStore)
const transaction = reactive({
  amount: requestId && request.value ? request.value.amount : 0,
  targets: requestId ? targetIds : [],
  request: requestId,
  tags: requestId ? tagIds : [],
  group: requestId && request.value ? request.value.group.id : ''
})
async function postTransaction() {
  if (transaction.targets.length === 0) {
    toast.warning('払い戻し対象者は必須です')
    return
  }
  await apis.postTransaction(transaction)
}

onMounted(async () => {
  if (!groupStore.isGroupFetched) {
    await groupStore.fetchGroups()
  }
  if (!userStore.isUserFetched) {
    await userStore.fetchUsers()
  }
  if (!tagStore.isTagFetched) {
    await tagStore.fetchTags()
  }
  await requestDetailStore.fetchRequestDetail(requestId)
})
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
          <FormInputNumber v-model="transaction.amount" class="mr-1" />円
        </div>
      </div>
      <div class="flex flex-col">
        <label>払い戻し対象者：</label>
        <VueSelect
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
        <VueSelect
          v-model="transaction.group"
          label="name"
          :options="groupStore.groups"
          placeholder="グループ"
          :reduce="(group:any) => group.id" />
      </div>
      <div class="flex flex-col">
        <label>タグ：</label>
        <VueSelect
          v-model="transaction.tags"
          :close-on-select="false"
          label="name"
          multiple
          :options="tagStore.tags"
          placeholder="タグ"
          :reduce="(tag:any) => tag.id" />
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
