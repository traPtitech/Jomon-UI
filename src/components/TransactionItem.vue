<script lang="ts" setup>
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'

import type { Transaction } from '/@/lib/apis'

import EditButton from './shared/EditButton.vue'
import TagGroup from './shared/TagGroup.vue'

const formatDate = (date: string) => {
  return (
    date.split('-')[0] +
    '年' +
    date.split('-')[1] +
    '月' +
    date.split('-')[2].split('T')[0] +
    '日'
  )
}

interface Props {
  transaction: Transaction
}
const props = defineProps<Props>()
</script>

<template>
  <div class="relative flex h-12 items-center gap-2">
    <div class="w-2/10">
      {{ formatDate(props.transaction.created_at) }}
    </div>
    <div class="w-1/10">
      {{ props.transaction.amount }}
    </div>
    <div class="w-2/10">
      {{ props.transaction.target }}
    </div>
    <div class="w-2/10 truncate">
      {{ props.transaction.group.description }}
    </div>
    <div class="w-3/10">
      <tag-group :limit="3" :tags="props.transaction.tags" />
    </div>
    <div class="absolute -right-16">
      <router-link class="mr-2" :to="`/requests/${transaction.request}`">
        <arrow-top-right-on-square-icon class="h-5" />
      </router-link>
      <edit-button />
    </div>
  </div>
</template>
