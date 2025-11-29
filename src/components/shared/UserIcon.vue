<script lang="ts" setup>
import { UserCircleIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'

const props = defineProps<{
  name?: string
}>()

const hasImageError = ref(false)
</script>

<template>
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
</template>
