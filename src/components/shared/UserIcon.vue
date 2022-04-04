<script lang="ts" setup>
interface Props {
  name: string
}
defineProps<Props>()
</script>

<template>
  <img
    alt="icon"
    class="h-full rounded-1/2 p-1"
    :src="'https://q.trap.jp/api/v3/public/icon/' + name" />
</template>
