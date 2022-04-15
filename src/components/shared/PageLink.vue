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
    :class="selected ? 'bg-blue-300 cursor-default' : 'hover:text-blue-800'"
    :to="`${path}?pageIndex=${page}`">
    <span>{{ page }}</span>
  </router-link>
</template>
