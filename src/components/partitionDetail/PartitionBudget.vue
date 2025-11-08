<script lang="ts" setup>
import { usePartitionStore } from '@/features/partition/store'
import { isBudgetNull } from '@/features/shared/isBudgetNull';

const { currentPartition: partition } = usePartitionStore()
</script>

<template>
  <div v-if="partition" class="flex flex-col gap-3">
    <h2 class="text-xl">予算</h2>
    <p v-if="isBudgetNull(partition.budget)">指定なし</p>
    <p v-else>{{ partition?.budget }} 円</p>
  </div>
</template>
