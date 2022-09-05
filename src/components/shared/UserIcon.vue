<script lang="ts" setup>
interface Props {
  name: string
}
const props = defineProps<Props>()
</script>

<template>
  <img
    :alt="props.name"
    class="rounded-1/2 h-full p-1"
    :src="`https://q.trap.jp/api/v3/public/icon/${props.name}`" />
</template>
