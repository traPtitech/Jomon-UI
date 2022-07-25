<script lang="ts" setup>
interface Props {
  path: string
  page: number
  selected: boolean
}
defineProps<Props>()
</script>

<template>
  <router-link
    class="block flex w-10 items-center justify-center rounded"
    :class="selected ? 'cursor-default bg-blue-200' : 'hover:bg-gray-200'"
    :to="`${path}?page=${page}`">
    <span>{{ page }}</span>
  </router-link>
</template>
