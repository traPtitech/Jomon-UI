<script lang="ts" setup>
interface Props {
  path: string
  page: number
  selected: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <router-link
    class="block flex w-10 items-center justify-center rounded"
    :class="props.selected ? 'cursor-default bg-blue-200' : 'hover:bg-gray-200'"
    :to="`${props.path}?page=${props.page}`">
    <span>{{ props.page }}</span>
  </router-link>
</template>
