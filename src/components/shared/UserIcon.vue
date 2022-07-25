<script lang="ts" setup>
interface Props {
  name: string
}
defineProps<Props>()
</script>

<template>
  <img
    alt="icon"
    class="rounded-1/2 h-full p-1"
    :src="'https://q.trap.jp/api/v3/public/icon/' + name" />
</template>
