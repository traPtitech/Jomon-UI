<script lang="ts" setup>
interface Props {
  name: string
}
const props = defineProps<Props>()
</script>

<template>
  <img
    :src="'https://q.trap.jp/api/v3/public/icon/' + name"
    alt="icon"
    class="h-full rounded-1/2 p-1"
  />
</template>
