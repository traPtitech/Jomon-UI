<script lang="ts" setup>
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'

import { useGroupStore } from '/@/stores/group'
import { useRequestStore } from '/@/stores/request'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import InputSelectSingle from '/@/components/shared/InputSelectSingle.vue'
import InputText from '/@/components/shared/InputText.vue'
import { useFetchRequestsUsecase } from '/@/features/request/usecase'
import { requestStatusOptions } from '/@/features/requestStatus/model'

const { requests, filterParams } = useRequestStore()
const { userOptions } = useUserStore()
const { tagIdOptions } = useTagStore()
const { groupOptions } = useGroupStore()

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
      <InputText
        v-model="filterParams.since"
        class="w-28"
        placeholder="yyyy-MM-dd"
        @blur="useFetchRequestsUsecase" />
      ～
      <InputText
        v-model="filterParams.until"
        class="w-28"
        placeholder="yyyy-MM-dd"
        @blur="useFetchRequestsUsecase" />
    </div>
    <InputSelectSingle
      v-model="filterParams.target"
      :options="userOptions"
      placeholder="申請者"
      @close="useFetchRequestsUsecase" />
    <InputSelectSingle
      v-model="filterParams.currentStatus"
      :options="requestStatusOptions()"
      placeholder="申請の状態"
      @close="useFetchRequestsUsecase" />
    <InputSelectSingle
      v-model="filterParams.group"
      :options="groupOptions"
      placeholder="グループ"
      @close="useFetchRequestsUsecase" />
    <InputSelectMultiple
      v-model="filterParams.tags"
      :options="tagIdOptions"
      placeholder="タグ"
      @close="useFetchRequestsUsecase" />
  </div>
  <span v-if="requests && requests.length !== 0" class="ml-1/6">
    {{ requests.length }}件取得しました
  </span>
  <span v-else class="ml-1/6"> 条件に一致する申請は見つかりませんでした </span>
</template>
