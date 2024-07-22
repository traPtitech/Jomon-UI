<script lang="ts" setup>
import type { Group } from '/@/features/group/model'

interface Props {
  group: Group
}

const props = defineProps<Props>()
</script>

<template>
  <router-link :to="`/groups/${props.group.id}`">
    <div
      class="flex h-12 items-center justify-around px-4 hover:bg-hover-secondary">
      <div class="w-1/5">{{ props.group.name }}</div>
      <div class="w-3/5 truncate">{{ props.group.description }}</div>
      <div class="w-1/5">
        {{ props.group.budget }}
      </div>
    </div>
  </router-link>
</template>
