<script lang="ts" setup>
import { computed } from 'vue'

import { formatDate } from '/@/lib/date'

import TagsGroup from '/@/components/shared/TagsGroup.vue'
import type { Transaction } from '/@/features/transaction/model'

interface Props {
  transaction: Transaction
}
const props = defineProps<Props>()

const formattedDate = computed(() => formatDate(props.transaction.createdAt))
</script>

<template>
  <router-link :to="`transactions/${transaction.id}`">
    <div
      class="children:px-2 relative flex h-12 items-center px-4 hover:bg-hover-secondary">
      <div class="w-1/6">
        {{ formattedDate }}
      </div>
      <div class="w-1/12 text-right">
        <span
          :class="` ${
            props.transaction.amount > 0
              ? 'text-blue-500'
              : 'text-error-primary'
          }`">
          {{ props.transaction.amount }}円
        </span>
      </div>
      <div class="w-1/6">
        {{ props.transaction.target }}
      </div>
      <div class="w-1/6 truncate">
        {{
          props.transaction.group ? props.transaction.group.description : 'なし'
        }}
      </div>
      <div class="w-5/12">
        <TagsGroup :limit="3" :tags="props.transaction.tags" />
      </div>
    </div>
  </router-link>
</template>
