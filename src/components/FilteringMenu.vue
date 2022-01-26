<script lang="ts" setup>
import { ref } from 'vue'
const type_items = [
  { type: 'club', jpn: '部費利用申請' },
  { type: 'contest', jpn: '大会等旅費補助申請' },
  { type: 'event', jpn: 'イベント交通費補助申請' },
  { type: 'public', jpn: '渉外交通費補助' }
]
const state_items = [
  { state: 'submitted', jpn: '提出済み' },
  { state: 'rejected', jpn: '却下' },
  { state: 'fix_required', jpn: '要修正' },
  { state: 'accepted', jpn: '払い戻し待ち' },
  { state: 'fully_repaid', jpn: '払い戻し完了' }
]
const tag_items = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: '2020講習会',
    description: '2020年度講習会',
    created_at: '2022-01-25T14:06:32.381Z',
    updated_at: '2022-01-25T14:06:32.381Z'
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: '2021講習会',
    description: '2021年度講習会',
    created_at: '2022-01-27T14:06:32.381Z',
    updated_at: '2022-01-27T14:06:32.381Z'
  }
]
const group_items = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'SysAd',
    description: 'SysAd班',
    budget: 250000,
    created_at: '2022-01-25T14:06:32.381Z',
    updated_at: '2022-01-25T14:06:32.381Z'
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'Game',
    description: 'Game班',
    budget: 50000,
    created_at: '2022-01-27T14:06:32.381Z',
    updated_at: '2022-01-27T14:06:32.381Z'
  }
]
const users = [
  {
    name: 'nagatech',
    display_name: 'ながてち',
    admin: true,
    created_at: '2022-01-25T13:45:37.048Z',
    updated_at: '2022-01-25T13:45:37.048Z',
    deleted_at: '2022-01-25T13:45:37.048Z'
  },
  {
    name: 'mehm8128',
    display_name: 'mehm8128',
    admin: false,
    created_at: '2022-01-27T13:45:37.048Z',
    updated_at: '2022-01-27T13:45:37.048Z',
    deleted_at: '2022-01-27T13:45:37.048Z'
  }
]
const params = ref({
  sort: 'created_at',
  current_state: '',
  year: '',
  target: '',
  type: '',
  since: '',
  until: '',
  tag: '',
  group: ''
})
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
function getRequests() {
  /*getリクエスト*/
}
function resetParams() {
  params.value = {
    sort: 'created_at',
    current_state: '',
    year: '',
    target: '',
    type: '',
    since: '',
    until: '',
    tag: '',
    group: ''
  }
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
        <option v-for="(tag, index) in tag_items" :key="index">
          {{ tag.name }}
        </option>
      </select>
      <select v-model="params.group">
        <option value="">グループ</option>
        <option v-for="(group, index) in group_items" :key="index">
          {{ group.name }}
        </option>
      </select>
    </div>
    <div class="flex justify-around">
      <button @click="getRequests">絞り込み</button>
      <button @click="resetParams">リセット</button>
    </div>
  </div>
</template>
