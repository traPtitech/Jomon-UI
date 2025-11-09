<script lang="ts" setup>
import { isBudgetNotSet } from '@/features/partition/lib/isBudgetNotSet'
import { usePartitionStore } from '@/features/partition/store'

const { currentPartition: partition } = usePartitionStore()
</script>

<template>
  <div v-if="partition" class="flex flex-col gap-3">
    <h2 class="text-xl">予算</h2>
    <p v-if="isBudgetNotSet(partition.budget)">指定なし</p>
    <p v-else>{{ partition?.budget }} 円</p>
  </div>
</template>
