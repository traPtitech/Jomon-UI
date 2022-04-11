<script lang="ts" setup>
import type { Group } from '../lib/apis'

type Props = { group: Group }
const props = defineProps<Props>()
</script>

<template>
  <router-link :to="'/groups/' + group.id">
    <div class="flex justify-around items-center hover:bg-gray-100 h-12 px-4">
      <div class="w-1/5">{{ group.name }}</div>
      <div class="w-3/5 truncate">{{ group.description }}</div>
      <div class="w-1/5">
        {{ group.budget }}
      </div>
    </div>
  </router-link>
</template>
