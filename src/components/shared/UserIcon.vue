<script lang="ts" setup>
import { ref, watch } from 'vue'

import { UserCircleIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  name?: string | undefined
}>()

const hasImageError = ref(false)

watch(
  () => props.name,
  () => {
    hasImageError.value = false
  }
)
</script>

<template>
  <span class="inline-block h-full">
    <img
      v-if="props.name && !hasImageError"
      :alt="props.name"
      class="h-full rounded-full p-1"
      :src="`https://q.trap.jp/api/v3/public/icon/${props.name}`"
      :title="props.name"
      @error="hasImageError = true" />
    <UserCircleIcon
      v-else
      class="h-full p-1 text-gray-400"
      title="不明なユーザー" />
  </span>
</template>
