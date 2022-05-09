<script lang="ts" setup>
interface Props {
  isHere: boolean
  path: string
  text: string
}
defineProps<Props>()
</script>

<template>
  <router-link :class="isHere ? 'cursor-default' : ''" :to="path">
    <div
      class="p-2 rounded-3xl"
      :class="isHere ? 'bg-zinc-200' : 'hover:bg-zinc-200'">
      <span>{{ text }}</span>
    </div>
  </router-link>
</template>
