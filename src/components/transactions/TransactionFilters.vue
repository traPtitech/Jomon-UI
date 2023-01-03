<script lang="ts" setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'

import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import InputSelectSingle from '/@/components/shared/InputSelectSingle.vue'
import InputText from '/@/components/shared/InputText.vue'

import SortOrderButtons from './SortOrderButtons.vue'

const transactionStore = useTransactionStore()
const groupStore = useGroupStore()
const tagStore = useTagStore()

const isFilterByTarget = ref(false)

const { fetchTransactions } = transactionStore
const { filterParams } = storeToRefs(transactionStore)
const { groupOptions } = storeToRefs(groupStore)
const { tagIdOptions } = storeToRefs(tagStore)

function changeIsTargetSearchMode() {
  if (isFilterByTarget.value) {
    filterParams.value.target = ''
    isFilterByTarget.value = false
  } else {
    isFilterByTarget.value = true
  }
}
function sort(sortKind: 'created_at' | 'amount') {
  if (sortKind === 'created_at') {
    if (filterParams.value.sort === 'created_at') {
      filterParams.value.sort = '-created_at'
    } else if (filterParams.value.sort === '-created_at') {
      filterParams.value.sort = ''
    } else {
      filterParams.value.sort = 'created_at'
    }
  } else {
    if (filterParams.value.sort === 'amount') {
      filterParams.value.sort = '-amount'
    } else if (filterParams.value.sort === '-amount') {
      filterParams.value.sort = ''
    } else {
      filterParams.value.sort = 'amount'
    }
  }
  fetchTransactions(filterParams.value)
}

const sortOption = computed(() => (sortKind: 'created_at' | 'amount') => {
  if (sortKind === 'created_at') {
    if (filterParams.value.sort === 'created_at') {
      return 'asc'
    } else if (filterParams.value.sort === '-created_at') {
      return 'desc'
    } else {
      return 'none'
    }
  } else {
    if (filterParams.value.sort === 'amount') {
      return 'asc'
    } else if (filterParams.value.sort === '-amount') {
      return 'desc'
    } else {
      return 'none'
    }
  }
})
</script>

<template>
  <div class="divider">
    <div class="children:px-2 flex h-8 px-4">
      <!-- 年月日 -->
      <!-- todo:多分since,untilでの検索をつける -->
      <button
        class="w-3/20 flex items-center justify-between"
        @click="sort('created_at')">
        <span>年 月 日</span>
        <SortOrderButtons :sort="sortOption('created_at')" />
      </button>
      <!-- 取引額 -->
      <!-- todo:多分範囲で検索にする -->
      <button
        class="w-3/20 flex items-center justify-between"
        @click="sort('amount')">
        <span>取引額</span>
        <SortOrderButtons :sort="sortOption('amount')" />
      </button>
      <!-- 取引相手 -->
      <div class="w-4/20 flex h-full w-full items-center">
        <div v-if="!isFilterByTarget" class="w-full">
          <button
            class="flex w-full items-center justify-between"
            @click="changeIsTargetSearchMode">
            <span>取引相手</span>
            <MagnifyingGlassIcon class="mr-1 h-4" />
          </button>
        </div>
        <div v-else class="relative w-full">
          <InputText
            v-model="filterParams.target"
            class="w-full border-none"
            placeholder="取引相手" />
          <XMarkIcon
            class="absolute right-1 top-2 h-4 cursor-pointer"
            @click="changeIsTargetSearchMode" />
        </div>
      </div>
      <!-- グループ -->
      <InputSelectSingle
        v-model="filterParams.group"
        class="!w-2/10"
        :options="groupOptions"
        placeholder="取引グループ"
        @close="'updateTransactions'" />
      <!-- タグ -->
      <InputSelectMultiple
        v-model="filterParams.tags"
        class="!w-3/10"
        :options="tagIdOptions"
        placeholder="タグ"
        @close="'updateTransactions'" />
    </div>
  </div>
</template>

<style scoped>
.divider::after {
  content: '';
  display: block;
  width: 100%;
  height: 1px;
  background-color: #d4d4d8;
  margin-top: 8px;
}
</style>
