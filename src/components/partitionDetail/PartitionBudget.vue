<script lang="ts" setup>
import { usePartitionDetailStore } from '/@/stores/partitionDetail'

const { partition } = usePartitionDetailStore()
</script>

<template>
  <div v-if="partition" class="flex flex-col gap-3">
    <h2 class="text-xl">予算</h2>
    <p>{{ partition?.budget }} 円</p>
  </div>
</template>
