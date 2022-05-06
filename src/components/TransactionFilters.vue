<script lang="ts" setup>
import { SearchIcon, XIcon } from '@heroicons/vue/outline'
import { storeToRefs } from 'pinia'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
// import { useTransactionStore } from '/@/stores/transaction'

import SortOrderButtons from './SortOrderButtons.vue'
import VueSelect from './VueSelect.vue'

const groupStore = useGroupStore()
const { groups } = storeToRefs(groupStore)
const tagStore = useTagStore()
const { tags } = storeToRefs(tagStore)
</script>

<template>
  <div class="flex h-9 gap-2 items-center">
    <!-- 年月日 -->
    <div class="border flex h-full w-2/10 items-center justify-center">
      <span>年 月 日</span>
      <SortOrderButtons />
    </div>
    <!-- 取引額 -->
    <div class="border flex h-full w-1/10 items-center justify-center">
      <span>取引額</span>
      <SortOrderButtons />
    </div>
    <!-- 取引相手 -->
    <div class="border h-full w-2/10">
      <div v-if="true" class="flex h-full items-center justify-center">
        <span>取引相手</span>
        <SearchIcon class="cursor-pointer h-4" />
      </div>
      <div class="w-2/10" v-else>
        <input v-model="target" class="border-none h-9" type="text" />
        <XIcon class="cursor-pointer h-4" />
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
</template>
