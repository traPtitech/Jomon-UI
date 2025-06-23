<script lang="ts" setup>
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'

import { usePartitonStore } from '/@/stores/partiton'
import { useRequestStore } from '/@/stores/request'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import BaseInput from '/@/components/shared/BaseInput.vue'
import SearchSelect from '/@/components/shared/SearchSelect.vue'
import { useFetchRequestsUsecase } from '/@/features/request/usecase'
import { requestStatusOptions } from '/@/features/requestStatus/model'

const { requests, filterParams } = useRequestStore()
const { userOptions } = useUserStore()
const { tagIdOptions } = useTagStore()
const { partitonOptions } = usePartitonStore()

function sortByCreatedAt() {
  if (filterParams.value.sort === 'created_at') {
    filterParams.value.sort = '-created_at'
  } else {
    filterParams.value.sort = 'created_at'
  }
  useFetchRequestsUsecase()
}
</script>

<template>
  <div class="flex justify-around">
    <button
      class="flex items-center justify-center rounded-sm border border-surface-secondary p-1"
      :class="filterParams.sort === 'created_at' ? '' : 'bg-hover-primary'"
      @click="sortByCreatedAt">
      日付順
      <ChevronDownIcon v-if="filterParams.sort === 'created_at'" class="w-4" />
      <ChevronUpIcon v-if="filterParams.sort === '-created_at'" class="w-4" />
    </button>
    <div>
      <BaseInput
        v-model="filterParams.since"
        label="開始日"
        class="w-28"
        placeholder="yyyy-MM-dd"
        @blur="useFetchRequestsUsecase" />
      ～
      <BaseInput
        v-model="filterParams.until"
        label="終了日"
        class="w-28"
        placeholder="yyyy-MM-dd"
        @blur="useFetchRequestsUsecase" />
    </div>
    <SearchSelect
      v-model="filterParams.target"
      :options="userOptions"
      label="申請者"
      @close="useFetchRequestsUsecase" />
    <SearchSelect
      v-model="filterParams.currentStatus"
      :options="[...requestStatusOptions]"
      label="申請の状態"
      @close="useFetchRequestsUsecase" />
    <SearchSelect
      v-model="filterParams.partition"
      :options="partitonOptions"
      label="パーティション"
      @close="useFetchRequestsUsecase" />
    <SearchSelect
      v-model="filterParams.tags"
      :options="tagIdOptions"
      label="タグ"
      multiple
      @close="useFetchRequestsUsecase" />
  </div>
  <span v-if="requests && requests.length !== 0" class="ml-1/6">
    {{ requests.length }}件取得しました
  </span>
  <span v-else class="ml-1/6"> 条件に一致する申請は見つかりませんでした </span>
</template>
