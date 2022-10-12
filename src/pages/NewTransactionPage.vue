<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import apis from '/@/lib/apis'
import { toId } from '/@/lib/parseQueryParams'

import SimpleButton from '/@/components/shared/SimpleButton.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import { useRequestDetail } from '/@/pages/composables/requestDetail/useRequestDetail'

const route = useRoute()
const requestId = toId(route.query.requestID) //requestIDには申請の詳細画面から新規作成ページに移動するときだけIDを渡す

const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()

const { request, targetIds, tagIds, fetchRequestDetail } = useRequestDetail()
const transaction = ref({
  //requestのraective性が失われてそうでamountとgroupがバグってる
  amount: requestId && request.value ? request.value.amount : 0,
  targets: requestId ? targetIds : [],
  request: requestId,
  tags: requestId ? tagIds : [],
  group: requestId && request.value ? request.value.group.id : ''
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
  await fetchRequestDetail(requestId)
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
          <input
            v-model="transaction.amount"
            class="rounded border border-gray-300" />円
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
