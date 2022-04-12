<script lang="ts" setup>
import { ref } from 'vue'

import VueSelect from './shared/VueSelect.vue'
import { useGroupStore } from '/@/stores/group'
import { useRequestStore } from '/@/stores/request'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'
import type { Params } from '/@/types/requestsTypes'

const requestStore = useRequestStore()
const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()

const params = ref({
  sort: 'created_at',
  currentStatus: null,
  target: null,
  since: '',
  until: '',
  tag: null,
  group: null
} as Params)
const states = [
  { state: 'submitted', jpn: '承認待ち' },
  { state: 'rejected', jpn: '却下' },
  { state: 'fix_required', jpn: '要修正' },
  { state: 'accepted', jpn: '承認済み' },
  { state: 'fully_repaid', jpn: '返済完了' }
]
function sortByCreatedAt() {
  if (params.value.sort === 'created_at') {
    params.value.sort = '-created_at'
  } else {
    params.value.sort = 'created_at'
  }
  requestStore.fetchRequests(params.value)
}
function filterByDate() {
  const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
  //todo:余裕があればもっとしっかりバリデーション
  if (
    (params.value.since === '' && rule.test(params.value.until)) ||
    (params.value.until === '' && rule.test(params.value.since)) ||
    (rule.test(params.value.since) && rule.test(params.value.until)) ||
    (params.value.since === '' && params.value.until === '')
  ) {
    requestStore.fetchRequests(params.value)
  }
}
</script>

<template>
  <div class="flex justify-around">
    <button
      class="p-1 border border-gray-300"
      :class="params.sort === 'created_at' ? '' : 'bg-gray-200'"
      @click="sortByCreatedAt">
      日付順 <span v-if="params.sort === 'created_at'" class="text-xs">▼</span>
      <span v-if="params.sort === '-created_at'" class="text-xs">▲</span>
    </button>
    <div class="mt-1">
      <input
        v-model="params.since"
        class="border border-gray-300 w-28 h-8"
        placeholder="YYYY-MM-DD"
        @input="
          filterByDate
        " /><!--@changeによってフォームにフォーカスがあって何かキーが押されたときに日付の形式が正しければGETが送信される-->
      <span>～</span>
      <input
        v-model="params.until"
        class="border border-gray-300 w-28 h-8"
        placeholder="YYYY-MM-DD"
        @input="filterByDate" />
    </div>
    <VueSelect
      v-model="params.target"
      class="w-64"
      label="name"
      :options="userStore.users"
      placeholder="申請者"
      :reduce="(user:any) => user.name"
      @close="requestStore.fetchRequests(params)" />
    <VueSelect
      v-model="params.currentStatus"
      class="w-64"
      label="jpn"
      :options="states"
      placeholder="申請の状態"
      :reduce="(state:any) => state.state"
      :searchable="false"
      @close="requestStore.fetchRequests(params)" />
    <VueSelect
      v-model="params.group"
      class="w-64"
      label="name"
      :options="groupStore.groups"
      placeholder="グループ"
      :reduce="(group:any) => group.id"
      @close="requestStore.fetchRequests(params)" />
    <VueSelect
      v-model="requestStore.tagList"
      class="w-100"
      :close-on-select="false"
      label="name"
      multiple
      :options="tagStore.tags"
      placeholder="タグ"
      :reduce="(tag:any) => tag.id"
      @close="requestStore.fetchRequests(params)" />
  </div>
</template>
