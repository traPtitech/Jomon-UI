<script lang="ts" setup>
import { usePartitionStore } from '@/features/partition/store'
import { usePartitionGroupStore } from '@/features/partitionGroup/store'

const { currentPartition: partition } = usePartitionStore()
const { partitionGroupIdNameToMap } = usePartitionGroupStore()
</script>

<template>
  <div v-if="partition" class="flex flex-col gap-3">
    <h2 class="text-xl">パーティショングループ</h2>
    <p>{{ partitionGroupIdNameToMap.get(partition.parentPartitionGroupId) }}</p>
  </div>
</template>
