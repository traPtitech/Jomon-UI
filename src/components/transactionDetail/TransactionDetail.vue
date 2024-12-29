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
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-3">
      <h2 class="text-xl">年月日</h2>
      <p>{{ formattedDate }}</p>
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="text-xl">入出金</h2>
      <p>{{ Math.abs(transaction.amount) }}円</p>
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="text-xl">取引グループ</h2>
      <p>{{ transaction.group ? transaction.group.name : 'なし' }}</p>
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="text-xl">タグ</h2>
      <TagsGroup :tags="transaction.tags" />
    </div>
  </div>
</template>
