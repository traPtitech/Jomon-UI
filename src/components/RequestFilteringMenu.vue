<script lang="ts" setup>
import { ref } from 'vue'

import { useGroupStore } from '../stores/group'
import { useRequestStore } from '../stores/request'
import { useTagStore } from '../stores/tag'
import { useUserStore } from '../stores/user'
import { Params } from '../types/requestsTypes'
import VueSelect from './shared/VueSelect.vue'

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
      class="p-1 border border-solid border-gray-300"
      :class="params.sort === 'created_at' ? '' : 'bg-gray-200'"
      @click="sortByCreatedAt">
      日付順 <span v-if="params.sort === 'created_at'" class="text-xs">▼</span
      ><span v-if="params.sort === '-created_at'" class="text-xs">▲</span>
    </button>
    <div class="mt-1">
      <input
        @input="filterByDate"
        v-model="params.since"
        placeholder="YYYY-MM-DD"
        class="border border-solid border-gray-300 w-28 h-8" /><!--@changeによってフォームにフォーカスがあって何かキーが押されたときに日付の形式が正しければGETが送信される-->
      <span>～</span>
      <input
        @input="filterByDate"
        v-model="params.until"
        placeholder="YYYY-MM-DD"
        class="border border-solid border-gray-300 w-28 h-8" />
    </div>
    <VueSelect
      v-model="params.target"
      @close="requestStore.fetchRequests(params)"
      :options="userStore.users"
      :reduce="(user:any) => user.name"
      label="name"
      placeholder="申請者"
      class="w-64"></VueSelect>
    <VueSelect
      v-model="params.currentStatus"
      @close="requestStore.fetchRequests(params)"
      :options="states"
      :reduce="(state:any) => state.state"
      label="jpn"
      placeholder="申請の状態"
      :searchable="false"
      class="w-64"></VueSelect>
    <VueSelect
      v-model="params.group"
      @close="requestStore.fetchRequests(params)"
      :options="groupStore.groups"
      :reduce="(group:any) => group.id"
      label="name"
      placeholder="グループ"
      class="w-64"></VueSelect>
    <VueSelect
      v-model="requestStore.tagList"
      @close="requestStore.fetchRequests(params)"
      :options="tagStore.tags"
      :reduce="(tag:any) => tag.id"
      label="name"
      placeholder="タグ"
      multiple
      :closeOnSelect="false"
      class="w-100"></VueSelect>
  </div>
</template>
