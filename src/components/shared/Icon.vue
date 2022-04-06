<script lang="ts" setup>
type Props = {
  name: string
}
const props = defineProps<Props>()
</script>
<template>
  <img
    alt="icon"
    class="rounded-1/2 h-8"
    :src="
      'https://q.trap.jp/api/v3/public/icon/' + name
    " /><!--heightをなんとかする-->
</template>
