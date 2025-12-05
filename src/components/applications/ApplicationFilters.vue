<script lang="ts" setup>
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

import BaseTextInput from '@/components/shared/BaseInput/BaseTextInput.vue'
import SearchSelect from '@/components/shared/SearchSelect/SearchSelect.vue'
import { useApplicationStore } from '@/features/application/store'
import { applicationStatusOptions } from '@/features/applicationStatus/entities'
import { usePartitionStore } from '@/features/partition/store'
import { useTagStore } from '@/features/tag/store'
import { useUserStore } from '@/features/user/store'

import SearchMultiSelect from '../shared/SearchSelect/SearchMultiSelect.vue'

const { applications, filterParams, fetchApplications } = useApplicationStore()
const { userOptions } = useUserStore()
const { tagIdOptions } = useTagStore()
const { partitionOptions } = usePartitionStore()

const toast = useToast()

function sortByCreatedAt() {
  if (filterParams.value.sort === 'created_at') {
    filterParams.value.sort = '-created_at'
  } else {
    filterParams.value.sort = 'created_at'
  }
  fetchApplications().catch(() => {
    toast.error('申請の取得に失敗しました')
  })
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
      <BaseTextInput
        v-model="filterParams.since"
        label="開始日"
        class="w-28"
        placeholder="yyyy-MM-dd"
        @blur="fetchApplications" />
      ～
      <BaseTextInput
        v-model="filterParams.until"
        label="終了日"
        class="w-28"
        placeholder="yyyy-MM-dd"
        @blur="fetchApplications" />
    </div>
    <SearchSelect
      v-model="filterParams.target"
      class="w-full sm:w-auto"
      :options="userOptions"
      label="申請者"
      @close="fetchApplications" />
    <SearchSelect
      v-model="filterParams.currentStatus"
      class="w-full sm:w-auto"
      :options="[...applicationStatusOptions]"
      label="申請の状態"
      @close="fetchApplications" />
    <SearchSelect
      v-model="filterParams.partition"
      :options="partitionOptions"
      label="パーティション"
      @close="fetchApplications" />
    <SearchMultiSelect
      v-model="filterParams.tags"
      :options="tagIdOptions"
      label="タグ"
      @close="fetchApplications" />
  </div>
  <span v-if="applications && applications.length !== 0" class="ml-1/6">
    {{ applications.length }}件取得しました
  </span>
  <span v-else class="ml-1/6"> 条件に一致する申請は見つかりませんでした </span>
</template>
