<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRequestStore } from '../stores/request'
import { useTagAndGroupStore } from '../stores/tagAndGroup'
import { useUserStore } from '../stores/user'
const requestStore = useRequestStore()
const userStore = useUserStore()
const tagAndGroupStore = useTagAndGroupStore()
const { params } = storeToRefs(requestStore)
const { users } = storeToRefs(userStore)
const { tags, groups } = storeToRefs(tagAndGroupStore)
const type_items = [
  { type: 'club', jpn: '部費利用申請' },
  { type: 'contest', jpn: '大会等旅費補助申請' },
  { type: 'event', jpn: 'イベント交通費補助申請' },
  { type: 'public', jpn: '渉外交通費補助' }
]
const state_items = [
  { state: 'submitted', jpn: '承認待ち' },
  { state: 'rejected', jpn: '却下' },
  { state: 'fix_required', jpn: '要修正' },
  { state: 'accepted', jpn: '承認済み' },
  { state: 'fully_repaid', jpn: '返済完了' }
]
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
}
</script>

<template>
  <div
    class="
      flex flex-col
      justify-evenly
      w-440px
      h-300px
      bg-blue-100
      border-2 border-gray-500
    "
  >
    <div class="flex justify-around">
      <button @click="sortCreatedAsc">日付昇順</button>
      <button @click="sortCreatedDesc">日付降順</button>
      <button @click="sortTitleAsc">タイトル昇順</button>
      <button @click="sortTitleDesc">タイトル降順</button>
    </div>
    <div class="flex flex-col justify-around flex-1">
      <input v-model="params.year" placeholder="年度" />
      <div class="flex justify-around">
        <input v-model="params.since" placeholder="xxxx-xx-xx" />
        <span>～</span>
        <input v-model="params.until" placeholder="xxxx-xx-xx" />
      </div>
      <select v-model="params.target">
        <option value="">申請者</option>
        <option v-for="(user, index) in users" :key="index">
          {{ user.name }}
        </option>
      </select>
      <select v-model="params.current_state">
        <option value="">現在の状態</option>
        <option v-for="(state, index) in state_items" :key="index">
          {{ state.jpn }}
        </option>
      </select>
      <select v-model="params.type">
        <option value="">申請タイプ</option>
        <option v-for="(type, index) in type_items" :key="index">
          {{ type.jpn }}
        </option>
      </select>
      <select v-model="params.tag">
        <!--複数選択をもうちょいいい感じにできるようにする-->
        <!--ライブラリならvue-select、vue-multiselectとかよさそう-->
        <option value="">タグ</option>
        <option v-for="(tag, index) in tags" :key="index">
          {{ tag.name }}
        </option>
      </select>
      <select v-model="params.group">
        <option value="">グループ</option>
        <option v-for="(group, index) in groups" :key="index">
          {{ group.name }}
        </option>
      </select>
    </div>
    <div class="flex justify-around">
      <button @click="requestStore.getRequests">絞り込み</button>
      <button @click="requestStore.resetParams">リセット</button>
    </div>
  </div>
</template>
