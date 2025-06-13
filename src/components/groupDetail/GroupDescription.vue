<script lang="ts" setup>
import { useGroupDetailStore } from '/@/stores/groupDetail'

const { group } = useGroupDetailStore()
</script>

<template>
  <div v-if="group" class="flex flex-col gap-3">
    <h2 class="text-xl">詳細</h2>
    <div class="flex w-full">
      <p class="min-h-32 w-full rounded-sm border border-surface-secondary p-2">
        {{ group.description }}
      </p>
    </div>
  </div>
</template>
