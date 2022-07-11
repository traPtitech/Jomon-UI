<script lang="ts" setup>
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/outline'
import { ref } from 'vue'

import { useRequestStore } from '../stores/request'
import VueSelect from './shared/VueSelect.vue'
import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

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
})
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
</script>

<template>
  <div class="flex justify-around">
    <button
      class="flex items-center justify-center rounded border border-gray-300 p-1"
      :class="params.sort === 'created_at' ? '' : 'bg-gray-200'"
      @click="sortByCreatedAt">
      日付順
      <ChevronDownIcon v-if="params.sort === 'created_at'" class="w-4" />
      <ChevronUpIcon v-if="params.sort === '-created_at'" class="w-4" />
    </button>
    <div>
      <input
        v-model="params.since"
        class="h-8 w-28 rounded border border-gray-300 p-1"
        placeholder="YYYY-MM-DD"
        @blur="requestStore.fetchRequests(params)" />
      ～
      <input
        v-model="params.until"
        class="h-8 w-28 rounded border border-gray-300 p-1"
        placeholder="YYYY-MM-DD"
        @blur="requestStore.fetchRequests(params)" />
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
      v-model="params.tag"
      class="w-100"
      :close-on-select="false"
      label="name"
      multiple
      :options="tagStore.tags"
      placeholder="タグ"
      :reduce="(tag:any) => tag.id"
      @close="requestStore.fetchRequests(params)" />
  </div>
  <span v-if="requestStore.requests.length !== 0" class="ml-1/8">
    {{ requestStore.requests.length }}件取得しました
  </span>
  <span v-if="requestStore.requests.length === 0" class="ml-1/8">
    条件に一致する申請は見つかりませんでした
  </span>
</template>
