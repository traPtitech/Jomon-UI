<script lang="ts" setup>
import { SearchIcon } from '@heroicons/vue/outline'
import { XIcon } from '@heroicons/vue/solid'
import { ref } from 'vue'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'
import type { Params } from '/@/stores/transaction'

// import { useTransactionStore } from '/@/stores/transaction'
import SortOrderButtons from './SortOrderButtons.vue'
import VueSelect from './VueSelect.vue'

const transactionStore = useTransactionStore()
const groupStore = useGroupStore()
const tagStore = useTagStore()
const isTargetSearchMode = ref(false)

const params = ref<Params>({
  sort: 'created_at',
  target: null,
  group: null,
  tag: null
})

function changeIsTargetSearchMode() {
  if (isTargetSearchMode.value) {
    params.value.target = ''
    isTargetSearchMode.value = false
  } else {
    isTargetSearchMode.value = true
  }
}
function sortByCreatedAt() {
  if (params.value.sort === 'created_at') {
    params.value.sort = '-created_at'
  } else {
    params.value.sort = 'created_at'
  }
  transactionStore.fetchTransactions(params.value)
}
</script>

<template>
  <div class="flex h-8 gap-2">
    <!-- 年月日 -->
    <button
      class="w-2/10 flex items-center justify-center border"
      @click="sortByCreatedAt">
      <span>年 月 日</span>
      <SortOrderButtons />
    </button>
    <!-- 取引額 -->
    <div class="w-1/10 flex items-center justify-center border">
      <span>取引額</span>
      <SortOrderButtons />
    </div>
    <!-- 取引相手 -->
    <div class="w-2/10">
      <div
        v-if="!isTargetSearchMode"
        class="flex h-full items-center justify-center border">
        <button class="h-full w-full" @click="changeIsTargetSearchMode">
          <span>取引相手</span>
          <SearchIcon class="h-4" />
        </button>
      </div>
      <div v-else class="relative">
        <input v-model="params.target" class="h-8 w-full" type="text" />
        <XIcon
          class="absolute right-2 top-2 h-4 cursor-pointer"
          @click="changeIsTargetSearchMode" />
      </div>
    </div>
    <!-- グループ -->
    <VueSelect
      v-model="params.group"
      class="w-2/10"
      label="name"
      :options="groupStore.groups"
      placeholder="取引グループ"
      :reduce="(group:any) => group.id"
      @close="'updateTransactions'" />
    <!-- タグ -->
    <VueSelect
      v-model="params.tag"
      class="w-3/10"
      label="name"
      :options="tagStore.tags"
      placeholder="タグ"
      :reduce="(tag:any) => tag.id"
      @close="'updateTransactions'" />
  </div>
  <span v-if="transactionStore.transactions.length !== 0">
    {{ transactionStore.transactions.length }}件取得しました
  </span>
  <span v-else>条件に一致する申請は見つかりませんでした</span>
</template>
