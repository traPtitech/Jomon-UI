<script lang="ts" setup>
import type { Transaction } from '/@/lib/apis'
import { formatDate } from '/@/lib/date'

import TagGroup from './shared/TagGroup.vue'

interface Props {
  transaction: Transaction
}
const props = defineProps<Props>()
</script>

<template>
  <router-link :to="`transactions/${transaction.id}`">
    <div class="relative flex h-12 items-center gap-2 px-4 hover:bg-gray-100">
      <div class="md:w-2/10 w-3/10">
        {{ formatDate(props.transaction.created_at) }}
      </div>
      <div class="md:w-1/10 w-2/10 text-right">
        <span
          :class="` ${
            props.transaction.amount > 0 ? 'text-blue-400' : 'text-red-400'
          }`">
          {{ props.transaction.amount }}円
        </span>
      </div>
      <div class="md:w-2/10 w-5/10">
        {{ props.transaction.target }}
      </div>
      <div class="md:w-2/10 hidden truncate md:block">
        {{ props.transaction.group.description }}
      </div>
      <div class="md:w-3/10 hidden md:block">
        <tag-group :limit="3" :tags="props.transaction.tags" />
      </div>
    </div>
  </router-link>
</template>
