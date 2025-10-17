<script lang="ts" setup>
import { usePartitionStore } from '@/features/partition/store'

const { currentPartition: partition } = usePartitionStore()
</script>

<template>
  <div v-if="partition" class="flex flex-col gap-3">
    <h2 class="text-xl">予算</h2>
    <p v-if="partition?.budget<10000000">{{ partition?.budget }} 円</p>
    <p v-else>無制限</p>
    <!-- 異常に大きい場合は無制限と表示 -->
  </div>
</template>
