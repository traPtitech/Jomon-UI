<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useGroupStore } from '../stores/group'
import { useRequestStore } from '../stores/request'
import { useTagStore } from '../stores/tag'
import { useUserStore } from '../stores/user'
import VueSelect from './VueSelect.vue'

const requestStore = useRequestStore()
const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const { params, tagList } = storeToRefs(requestStore)
const { users } = storeToRefs(userStore)
const { tags } = storeToRefs(tagStore)
const { groups } = storeToRefs(groupStore)

const states = ref([
  { state: 'submitted', jpn: '承認待ち' },
  { state: 'rejected', jpn: '却下' },
  { state: 'fix_required', jpn: '要修正' },
  { state: 'accepted', jpn: '承認済み' },
  { state: 'fully_repaid', jpn: '返済完了' }
])
function sortByCreatedAt() {
  if (params.value.sort === 'created_at') {
    params.value.sort = '-created_at'
  } else {
    params.value.sort = 'created_at'
  }
  requestStore.getRequests()
}
//todo:日時のバリデーション追加
</script>

<template>
  <div class="flex justify-around">
    <button
      class="p-1 border border-solid border-gray-300"
      :class="params.sort === 'created_at' ? '' : 'bg-gray-200'"
      @click="sortByCreatedAt"
    >
      日付順 <span v-if="params.sort === 'created_at'" class="text-xs">▼</span
      ><span v-if="params.sort === '-created_at'" class="text-xs">▲</span>
    </button>
    <div class="mt-1">
      <input
        v-model="params.since"
        placeholder="xxxx-xx-xx"
        class="border border-solid border-gray-300 w-20"
      />
      <span>～</span>
      <input
        v-model="params.until"
        placeholder="xxxx-xx-xx"
        class="border border-solid border-gray-300 w-20"
      />
    </div>
    <VueSelect
      v-model="params.target"
      @close="requestStore.getRequests"
      :options="users"
      :reduce="(user:any) => user.name"
      label="name"
      placeholder="申請者"
      class="w-64"
    ></VueSelect>
    <VueSelect
      v-model="params.current_state"
      @close="requestStore.getRequests"
      :options="states"
      :reduce="(state:any) => state.state"
      label="jpn"
      placeholder="申請の状態"
      :searchable="false"
      class="w-64"
    ></VueSelect>
    <VueSelect
      v-model="params.group"
      @close="requestStore.getRequests"
      :options="groups"
      :reduce="(group:any) => group.id"
      label="name"
      placeholder="グループ"
      class="w-64"
    ></VueSelect>
    <VueSelect
      v-model="tagList"
      @close="requestStore.getRequests"
      :options="tags"
      :reduce="(tag:any) => tag.id"
      label="name"
      placeholder="タグ"
      multiple
      class="w-100"
    ></VueSelect>
  </div>
</template>
