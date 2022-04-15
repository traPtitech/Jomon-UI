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
    class="rounded flex w-10 block justify-center items-center"
    :class="selected ? 'bg-gray-200 cursor-default' : 'hover:text-cyan-800'"
    :to="`${path}?page=${page}`">
    <span>{{ page }}</span>
  </router-link>
</template>
