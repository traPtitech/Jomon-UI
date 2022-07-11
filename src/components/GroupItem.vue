<script lang="ts" setup>
import type { Group } from '/@/lib/apis'

interface Props {
  group: Group
}

defineProps<Props>()
</script>

<template>
  <router-link :to="'/groups/' + group.id">
    <div class="flex h-12 items-center justify-around px-4 hover:bg-gray-100">
      <div class="w-1/5">{{ group.name }}</div>
      <div class="w-3/5 truncate">{{ group.description }}</div>
      <div class="w-1/5">
        {{ group.budget }}
      </div>
    </div>
  </router-link>
</template>
