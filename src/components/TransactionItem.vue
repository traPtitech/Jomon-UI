<script lang="ts" setup>
import { ExternalLinkIcon } from '@heroicons/vue/outline'

import type { Transaction } from '/@/lib/apis'

import EditButton from './shared/EditButton.vue'
import Tags from './shared/Tags.vue'

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

type Props = { transaction: Transaction }
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
      <Tags :limit="3" :tags="props.transaction.tags" />
    </div>
    <div class="absolute -right-16">
      <router-link class="mr-2" :to="`/requests/${transaction.request}`">
        <ExternalLinkIcon class="h-5" />
      </router-link>
      <EditButton />
    </div>
  </div>
</template>
