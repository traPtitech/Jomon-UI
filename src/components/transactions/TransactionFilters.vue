<script lang="ts" setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { computed, reactive, ref } from 'vue'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'
import type { SearchTransactionParams } from '/@/stores/transaction'

import InputSelect from '/@/components//shared/InputSelect.vue'
import InputText from '/@/components/shared/InputText.vue'

import SortOrderButtons from './SortOrderButtons.vue'

const transactionStore = useTransactionStore()
const groupStore = useGroupStore()
const tagStore = useTagStore()
const isTargetSearchMode = ref(false)

const params = reactive<SearchTransactionParams>({
  sort: 'created_at',
  target: '',
  since: '',
  until: '',
  group: '',
  tag: [],
  request: ''
})

function changeIsTargetSearchMode() {
  if (isTargetSearchMode.value) {
    params.target = ''
    isTargetSearchMode.value = false
  } else {
    isTargetSearchMode.value = true
  }
}
function sort(sortKind: 'created_at' | 'amount') {
  if (sortKind === 'created_at') {
    if (params.sort === 'created_at') {
      params.sort = '-created_at'
    } else if (params.sort === '-created_at') {
      params.sort = ''
    } else {
      params.sort = 'created_at'
    }
  } else {
    if (params.sort === 'amount') {
      params.sort = '-amount'
    } else if (params.sort === '-amount') {
      params.sort = ''
    } else {
      params.sort = 'amount'
    }
  }
  transactionStore.fetchTransactions(params)
}

const sortOption = computed(() => (sortKind: 'created_at' | 'amount') => {
  if (sortKind === 'created_at') {
    if (params.sort === 'created_at') {
      return 'asc'
    } else if (params.sort === '-created_at') {
      return 'desc'
    } else {
      return 'none'
    }
  } else {
    if (params.sort === 'amount') {
      return 'asc'
    } else if (params.sort === '-amount') {
      return 'desc'
    } else {
      return 'none'
    }
  }
})
</script>

<template>
  <div class="divider">
    <div class="flex h-8 gap-2 px-4">
      <div class="children:px-2 divide-x-1 flex w-1/2 items-center">
        <!-- 年月日 -->
        <!-- todo:多分since,untilでの検索をつける -->
        <button
          class="w-3/10 flex items-center justify-between"
          @click="sort('created_at')">
          <span>年 月 日</span>
          <SortOrderButtons :sort="sortOption('created_at')" />
        </button>
        <!-- 取引額 -->
        <button
          class="w-3/10 flex items-center justify-between"
          @click="sort('amount')">
          <span>取引額</span>
          <SortOrderButtons :sort="sortOption('amount')" />
        </button>
        <!-- 取引相手 -->
        <div class="w-4/10 flex h-full w-full items-center">
          <div v-if="!isTargetSearchMode" class="w-full">
            <button
              class="flex h-full w-full items-center justify-between"
              @click="changeIsTargetSearchMode">
              <span>取引相手</span>
              <MagnifyingGlassIcon class="h-4" />
            </button>
          </div>
          <div v-else class="relative w-full">
            <InputText
              v-model="params.target"
              class="w-full border-none"
              type="text" />
            <XMarkIcon
              class="absolute right-2 top-2 h-4 cursor-pointer"
              @click="changeIsTargetSearchMode" />
          </div>
        </div>
      </div>
      <!-- グループ -->
      <InputSelect
        v-model="params.group"
        class="!w-2/10"
        :options="groupStore.groupOptions"
        placeholder="取引グループ"
        @close="'updateTransactions'" />
      <!-- タグ -->
      <InputSelect
        v-model="params.tag"
        class="!w-3/10"
        is-multiple
        :options="tagStore.tagOptions"
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
