<script lang="ts" setup>
import {
  ArrowCircleUpIcon,
  ArrowCircleDownIcon,
  SearchIcon,
  XIcon
} from '@heroicons/vue/outline'
import {
  ArrowCircleUpIcon as ArrowCircleUpIconSolid,
  ArrowCircleDownIcon as ArrowCircleDownIconSolid
} from '@heroicons/vue/solid'
import { ref } from 'vue'

import VueSelect from './VueSelect.vue'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'

const transactionStore = useTransactionStore()
const tagStore = useTagStore()

const target = ref('')
const group = ref('')
const tag = ref('')

const sortBy = ref('created_at')
const sortTransactions = () => {
  transactionStore.fetchTransactions(sortBy.value)
}
</script>
<template>
  <div class="flex h-9">
    <div
      class="border flex w-3/20"
      :class="
        sortBy === 'created_at' || sortBy === '-created_at' ? 'bg-gray-200' : ''
      ">
      <span class="mt-2 ml-1/5">年 月 日</span>
      <ArrowCircleDownIconSolid
        v-if="sortBy === 'created_at'"
        class="cursor-pointer mt-1 w-5" />
      <ArrowCircleDownIcon
        v-else
        class="cursor-pointer mt-1 w-5"
        @click="sortTransactions" />
      <ArrowCircleUpIconSolid
        v-if="sortBy === '-created_at'"
        class="cursor-pointer mt-1 w-5" />
      <ArrowCircleUpIcon
        v-else
        class="cursor-pointer mt-1 w-5"
        @click="sortTransactions" />
    </div>
    <div
      class="border flex w-3/20"
      :class="sortBy === 'amount' || sortBy === '-amount' ? 'bg-gray-200' : ''">
      <span class="mt-2 ml-1/4">取引額</span>
      <ArrowCircleDownIconSolid
        v-if="sortBy === 'amount'"
        class="cursor-pointer mt-1 w-5" />
      <ArrowCircleDownIcon
        v-else
        class="cursor-pointer mt-1 w-5"
        @click="sortTransactions" />
      <ArrowCircleUpIconSolid
        v-if="sortBy === '-amount'"
        class="cursor-pointer mt-1 w-5" />
      <ArrowCircleUpIcon
        v-else
        class="cursor-pointer mt-1 w-5"
        @click="sortTransactions" />
    </div>
    <div class="border w-3/20">
      <div v-if="true" class="mt-2 text-center">
        取引相手<SearchIcon
          class="cursor-pointer h-4 ml-1 w-5"
          @click="() => {}" />
      </div>
      <div v-else>
        <input v-model="target" class="border-none h-9 w-7/8" type="text" />
        <XIcon
          class="cursor-pointer w-5"
          @click="
            // CLOSE
            target = ''
          " />
      </div>
    </div>
    <VueSelect
      v-model="group"
      class="w-3/20"
      label="name"
      :options="['Sysad', 'Sysad2']"
      placeholder="取引グループ"
      :reduce="(group:any) => group.id"
      @close="transactionStore.fetchTransactions"></VueSelect>
    <VueSelect
      v-model="tag"
      class="w-2/5"
      label="name"
      :options="tagStore.tags"
      placeholder="タグ"
      :reduce="(tag:any) => tag.id"
      @close="transactionStore.fetchTransactions"></VueSelect>
  </div>
</template>
