<script lang="ts" setup>
import { SearchIcon, XIcon } from '@heroicons/vue/outline'
import { storeToRefs } from 'pinia'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'

// import { useTransactionStore } from '/@/stores/transaction'
import SortOrderButtons from './SortOrderButtons.vue'
import VueSelect from './VueSelect.vue'

const transactionStore = useTransactionStore()
const groupStore = useGroupStore()
const { groups } = storeToRefs(groupStore)
const tagStore = useTagStore()
const { tags } = storeToRefs(tagStore)
</script>

<template>
  <div class="flex h-8 gap-2">
    <!-- 年月日 -->
    <div class="w-2/10 flex items-center justify-center border">
      <span>年 月 日</span>
      <SortOrderButtons />
    </div>
    <!-- 取引額 -->
    <div class="w-1/10 flex items-center justify-center border">
      <span>取引額</span>
      <SortOrderButtons />
    </div>
    <!-- 取引相手 -->
    <div class="w-2/10 border">
      <div v-if="true" class="flex h-full items-center justify-center">
        <span>取引相手</span>
        <SearchIcon class="h-4 cursor-pointer" />
      </div>
      <div v-else>
        <input v-model="target" class="border-none" type="text" />
        <XIcon class="h-4 cursor-pointer" />
      </div>
    </div>
    <!-- グループ -->
    <VueSelect
      v-model="group"
      class="w-2/10"
      label="name"
      :options="groups"
      placeholder="取引グループ"
      :reduce="(group:any) => group.id"
      @close="'updateTransactions'" />
    <!-- タグ -->
    <VueSelect
      v-model="tag"
      class="w-3/10"
      label="name"
      :options="tags"
      placeholder="タグ"
      :reduce="(tag:any) => tag.id"
      @close="'updateTransactions'" />
  </div>
  <span v-if="transactionStore.transactions.length !== 0">
    {{ transactionStore.transactions.length }}件取得しました
  </span>
  <span v-else>条件に一致する申請は見つかりませんでした</span>
</template>
