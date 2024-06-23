<script lang="ts" setup>
// TODO: sizeも受け取りたい
defineProps<{
  name: string
}>()
</script>

<template>
  <img
    :alt="name"
    class="rounded-1/2 h-full p-1"
    :src="`https://q.trap.jp/api/v3/public/icon/${name}`"
    :title="name" />
</template>
