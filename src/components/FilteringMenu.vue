<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { useGroupStore } from '../stores/group'
import { useRequestStore } from '../stores/request'
import { useTagStore } from '../stores/tag'
import { useUserStore } from '../stores/user'

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
function sortCreatedAsc() {
  params.value.sort = 'created_at'
}
function sortCreatedDesc() {
  params.value.sort = '-created_at'
}
function sortTitleAsc() {
  params.value.sort = 'title'
}
function sortTitleDesc() {
  params.value.sort = '-title'
} //todo:日時のバリデーション追加
</script>

<template>
  <div
    class="flex flex-col justify-evenly w-440px h-300px border-2 border-gray-500"
  >
    <div class="flex justify-around">
      <button
        :class="
          params.sort === 'created_at' ? 'border border-solid border-black' : ''
        "
        @click="sortCreatedAsc"
      >
        日付昇順
      </button>
      <button
        :class="
          params.sort === '-created_at'
            ? 'border border-solid border-black'
            : ''
        "
        @click="sortCreatedDesc"
      >
        日付降順
      </button>
      <button
        :class="
          params.sort === 'title' ? 'border border-solid border-black' : ''
        "
        @click="sortTitleAsc"
      >
        タイトル昇順
      </button>
      <button
        :class="
          params.sort === '-title' ? 'border border-solid border-black' : ''
        "
        @click="sortTitleDesc"
      >
        タイトル降順
      </button>
    </div>
    <div class="flex flex-col justify-around flex-1">
      <div class="flex justify-around">
        <input
          v-model="params.since"
          placeholder="xxxx-xx-xx"
          class="border border-solid border-black"
        />
        <span>～</span>
        <input
          v-model="params.until"
          placeholder="xxxx-xx-xx"
          class="border border-solid border-black"
        />
      </div>
      <v-select
        v-model="params.target"
        :options="users"
        :reduce="(user:any) => user.name"
        label="name"
        placeholder="申請者"
      ></v-select>
      <v-select
        v-model="params.current_state"
        :options="states"
        :reduce="(state:any) => state.state"
        label="jpn"
        placeholder="申請の状態"
      ></v-select>
      <v-select
        v-model="tagList"
        :options="tags"
        :reduce="(tag:any) => tag.id"
        label="name"
        placeholder="タグ"
        multiple
      ></v-select>
      <v-select
        v-model="params.group"
        :options="groups"
        :reduce="(group:any) => group.id"
        label="name"
        placeholder="グループ"
      ></v-select>
    </div>
    <div class="flex justify-around">
      <button @click="requestStore.getRequests">絞り込み</button>
      <button @click="requestStore.resetParams">リセット</button>
    </div>
  </div>
</template>
