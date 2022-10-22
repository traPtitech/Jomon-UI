<script lang="ts" setup>
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import { reactive } from 'vue'

import { useGroupStore } from '/@/stores/group'
import type { SearchRequestParams } from '/@/stores/request'
import { useRequestStore } from '/@/stores/request'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import InputSelect from '/@/components/shared/InputSelect.vue'
import InputText from '/@/components/shared/InputText.vue'
import { requestStatusOptions } from '/@/consts/consts'

const requestStore = useRequestStore()
const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()

const params = reactive<SearchRequestParams>({
  sort: 'created_at',
  currentStatus: '',
  target: '',
  since: '',
  until: '',
  tags: [],
  group: ''
})

function sortByCreatedAt() {
  if (params.sort === 'created_at') {
    params.sort = '-created_at'
  } else {
    params.sort = 'created_at'
  }
  requestStore.fetchRequests(params)
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
      <InputText
        v-model="params.since"
        class="w-28"
        placeholder="yyyy-MM-dd"
        @blur="requestStore.fetchRequests(params)" />
      ～
      <InputText
        v-model="params.until"
        class="w-28"
        placeholder="yyyy-MM-dd"
        @blur="requestStore.fetchRequests(params)" />
    </div>
    <InputSelect
      v-model="params.target"
      :options="userStore.userOptions"
      placeholder="申請者"
      @close="requestStore.fetchRequests(params)" />
    <InputSelect
      v-model="params.currentStatus"
      :options="requestStatusOptions()"
      placeholder="申請の状態"
      @close="requestStore.fetchRequests(params)" />
    <InputSelect
      v-model="params.group"
      :options="groupStore.groupOptions"
      placeholder="グループ"
      @close="requestStore.fetchRequests(params)" />
    <InputSelect
      v-model="params.tags"
      is-multiple
      :options="tagStore.tagOptions"
      placeholder="タグ"
      @close="requestStore.fetchRequests(params)" />
  </div>
  <span
    v-if="requestStore.requests && requestStore.requests.length !== 0"
    class="ml-1/8">
    {{ requestStore.requests.length }}件取得しました
  </span>
  <span v-else class="ml-1/8"> 条件に一致する申請は見つかりませんでした </span>
</template>