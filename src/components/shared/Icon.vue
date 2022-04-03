<script lang="ts" setup>
type Props = {
  name: string
}
const props = defineProps<Props>()
</script>
<template>
  <img
    :src="'https://q.trap.jp/api/v3/public/icon/' + name"
    alt="icon"
    class="rounded-1/2 h-8"
  /><!--heightをなんとかする-->
</template>
