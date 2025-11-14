<script lang="ts" setup>
import { usePartitionStore } from '@/features/partition/store'
import { loadPartitionGroupNames } from '@/features/partitionGroup/lib/loadPartitionGroupNames'

const { currentPartition: partition } = usePartitionStore()

const partitionGroupNames = await loadPartitionGroupNames()
</script>

<template>
  <div v-if="partition" class="flex flex-col gap-3">
    <h2 class="text-xl">パーティショングループ</h2>
    <p>{{ partitionGroupNames.get(partition.parentPartitionGroupId) }}</p>
  </div>
</template>
