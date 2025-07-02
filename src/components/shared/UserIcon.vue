<script lang="ts" setup>
withDefaults(
  defineProps<{
    size?: number
    name: string
  }>(),
  { size: 12 }
)
</script>

<template>
  <img
    :alt="name"
    :class="`rounded-full h-full p-1 w-${size}`"
    :src="`https://q.trap.jp/api/v3/public/icon/${name}`"
    :title="name" />
</template>
