<script lang="ts" setup>
import type { Transaction } from '/@/lib/apis'
import { formatDate } from '/@/lib/date'

import TagsGroup from '/@/components/shared/TagsGroup.vue'

interface Props {
  transaction: Transaction
}
const props = defineProps<Props>()
</script>

<template>
  <router-link :to="`transactions/${transaction.id}`">
    <div
      class="children:px-2 relative flex h-12 items-center px-4 hover:bg-gray-100">
      <div class="w-3/20">
        {{ formatDate(props.transaction.created_at) }}
      </div>
      <div class="w-3/20 text-right">
        <span
          :class="` ${
            props.transaction.amount > 0 ? 'text-blue-400' : 'text-red-400'
          }`">
          {{ props.transaction.amount }}円
        </span>
      </div>
      <div class="w-4/20">
        {{ props.transaction.target }}
      </div>
      <div class="w-2/10 truncate">
        {{ props.transaction.group.description }}
      </div>
      <div class="w-3/10">
        <TagsGroup :limit="3" :tags="props.transaction.tags" />
      </div>
    </div>
  </router-link>
</template>
