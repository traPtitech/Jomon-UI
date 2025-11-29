<script lang="ts" setup>
import { UserCircleIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  name?: string
}>()
</script>

<template>
  <img
    v-if="props.name"
    :alt="props.name"
    class="h-full rounded-full p-1"
    :src="`https://q.trap.jp/api/v3/public/icon/${props.name}`"
    :title="props.name" />
  <UserCircleIcon v-else class="text-gray-400" title="不明なユーザー" />
</template>
