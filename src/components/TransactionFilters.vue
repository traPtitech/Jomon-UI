<script lang="ts" setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { computed, reactive, ref } from 'vue'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'
import type { SearchTransactionParams } from '/@/stores/transaction'

// import { useTransactionStore } from '/@/stores/transaction'
import SortOrderButtons from './SortOrderButtons.vue'
import FormSelect from './shared/FormSelect.vue'

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
  <div class="flex h-8 gap-2">
    <!-- 年月日 -->
    <button
      class="w-2/10 flex items-center justify-center border"
      @click="sort('created_at')">
      <span>年 月 日</span>
      <SortOrderButtons :sort="sortOption('created_at')" />
    </button>
    <!-- 取引額 -->
    <button
      class="w-1/10 flex items-center justify-center border"
      @click="sort('amount')">
      <span>取引額</span>
      <SortOrderButtons :sort="sortOption('amount')" />
    </button>
    <!-- 取引相手 -->
    <div class="w-2/10">
      <div
        v-if="!isTargetSearchMode"
        class="flex h-full items-center justify-center border">
        <button class="h-full w-full" @click="changeIsTargetSearchMode">
          <span>取引相手</span>
          <MagnifyingGlassIcon class="h-4" />
        </button>
      </div>
      <div v-else class="relative">
        <input v-model="params.target" class="h-8 w-full" type="text" />
        <!-- todo:FormInputにする -->
        <XMarkIcon
          class="absolute right-2 top-2 h-4 cursor-pointer"
          @click="changeIsTargetSearchMode" />
      </div>
    </div>
    <!-- グループ -->
    <FormSelect
      v-model="params.group"
      class="!w-2/10"
      :options="groupStore.groupOptions"
      placeholder="取引グループ"
      @close="'updateTransactions'" />
    <!-- タグ -->
    <FormSelect
      v-model="params.tag"
      class="!w-3/10"
      :options="tagStore.tagOptions"
      placeholder="タグ"
      @close="'updateTransactions'" />
  </div>
</template>
