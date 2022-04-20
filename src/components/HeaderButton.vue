<script lang="ts" setup>
interface Props {
  fullpath: string
  path: string
  text: string
}
defineProps<Props>()
</script>
<template>
  <router-link :class="fullpath === path ? 'cursor-default' : ''" :to="path">
    <div
      class="p-2 rounded-3xl"
      :class="fullpath === path ? 'bg-zinc-200' : 'hover:bg-zinc-200'">
      <span>{{ text }}</span>
    </div>
  </router-link>
</template>
