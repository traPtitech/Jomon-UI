<script lang="ts" setup>
import { isBudgetSet } from '@/features/partition/lib/isBudgetSet'
import { usePartitionStore } from '@/features/partition/store'

const { currentPartition: partition } = usePartitionStore()
</script>

<template>
  <div v-if="partition" class="flex flex-col gap-3">
    <h2 class="text-xl">予算</h2>
    <p v-if="isBudgetSet(partition.budget)">{{ partition?.budget }} 円</p>
    <p v-else>指定なし</p>
  </div>
</template>
