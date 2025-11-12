<script lang="ts" setup>
import { usePartitionStore } from '@/features/partition/store'

const { currentPartition: partition } = usePartitionStore()
</script>

<template>
  <div v-if="partition" class="flex flex-col gap-3">
    <h2 class="text-xl">パーティショングループ</h2>
    <p>{{ partition?.parentPartitionGroupId }}</p>
  </div>
</template>
