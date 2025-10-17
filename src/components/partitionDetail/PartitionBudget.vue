<script lang="ts" setup>
import { usePartitionStore } from '@/features/partition/store'

const { currentPartition: partition } = usePartitionStore()
</script>

<template>
  <div v-if="partition" class="flex flex-col gap-3">
    <h2 class="text-xl">予算</h2>
    <p v-if="partition.budget !== null">{{ partition?.budget }} 円</p>
    <p v-else>無制限</p>
    <!-- budgetがnullの時に無制限と表示 -->
  </div>
</template>
