<script lang="ts" setup>
interface Props {
  path: string
  page: number
  isSelected: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <router-link
    class="flex w-10 items-center justify-center rounded"
    :class="
      props.isSelected ? 'cursor-default bg-blue-200' : 'hover:bg-hover-primary'
    "
    :to="`${props.path}?page=${props.page}`">
    <span>{{ props.page }}</span>
  </router-link>
</template>
