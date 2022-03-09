<script lang="ts" setup>
import { ref } from 'vue'

import { useTransactionStore } from '../stores/transaction'
import { useGroupStore } from '../stores/group'
import { useTagStore } from '../stores/tag'
import { storeToRefs } from 'pinia'
import { ArrowCircleUpIcon as ArrowCircleUpIconSolid, ArrowCircleDownIcon as ArrowCircleDownIconSolid } from '@heroicons/vue/solid'
import { ArrowCircleUpIcon, ArrowCircleDownIcon, SearchIcon, XIcon } from '@heroicons/vue/outline'
import VueSelect from './VueSelect.vue'

const transactionStore = useTransactionStore()
const groupStore = useGroupStore()
const tagStore = useTagStore()
const { params, isTargetSearchOpen } = storeToRefs(transactionStore)
function sortTransactions(sort: string) {
  params.value.sort = sort
  transactionStore.getTransactions()
}
</script>
<template>
  <div class="h-9 flex">
    <div
      class="w-3/20 flex border"
      :class="
        params.sort === 'created_at' || params.sort === '-created_at'
          ? 'bg-gray-200'
          : ''
      "
    >
      <span class="ml-1/5 mt-2">年 月 日</span>
      <ArrowCircleDownIconSolid
        v-if="params.sort === 'created_at'"
        class="w-5 mt-1 cursor-pointer"
      />
      <ArrowCircleDownIcon
        v-else
        class="w-5 mt-1 cursor-pointer"
        @click="sortTransactions('created_at')"
      />
      <ArrowCircleUpIconSolid
        v-if="params.sort === '-created_at'"
        class="w-5 mt-1 cursor-pointer"
      />
      <ArrowCircleUpIcon
        v-else
        class="w-5 mt-1 cursor-pointer"
        @click="sortTransactions('-created_at')"
      />
    </div>
    <div
      class="w-3/20 flex border"
      :class="
        params.sort === 'amount' || params.sort === '-amount'
          ? 'bg-gray-200'
          : ''
      "
    >
      <span class="ml-1/4 mt-2">取引額</span>
      <ArrowCircleDownIconSolid v-if="params.sort === 'amount'" class="w-5 mt-1 cursor-pointer" />
      <ArrowCircleDownIcon
        v-else
        class="w-5 mt-1 cursor-pointer"
        @click="sortTransactions('amount')"
      />
      <ArrowCircleUpIconSolid v-if="params.sort === '-amount'" class="w-5 mt-1 cursor-pointer" />
      <ArrowCircleUpIcon
        v-else
        class="w-5 mt-1 cursor-pointer"
        @click="sortTransactions('-amount')"
      />
    </div>
    <div class="w-3/20 border">
      <div v-if="isTargetSearchOpen === false" class="text-center mt-2">
        取引相手<SearchIcon class="w-5 ml-1 h-4 cursor-pointer" @click="isTargetSearchOpen = true" />
      </div>
      <div v-else>
        <input v-model="params.target" type="text" class="w-7/8 h-9 border-none">
        <XIcon @click="isTargetSearchOpen = false; params.target = ''" class="w-5 cursor-pointer" />
      </div>
    </div>
    <VueSelect
      v-model="params.group"
      @close="transactionStore.getTransactions"
      :options="groupStore.groups"
      :reduce="(group:any) => group.id"
      label="name"
      placeholder="取引グループ"
      class="w-3/20"
    ></VueSelect>
    <VueSelect
      v-model="params.tag"
      @close="transactionStore.getTransactions"
      :options="tagStore.tags"
      :reduce="(tag:any) => tag.id"
      label="name"
      placeholder="タグ"
      class="w-2/5"
    ></VueSelect>
  </div>
</template>
<style scoped>
.v-select__selections {
  border: none;
}
</style>