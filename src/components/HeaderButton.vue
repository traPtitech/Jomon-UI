<script lang="ts" setup>
interface Props {
  isHere: boolean
  path: string
  text: string
}

const props = defineProps<Props>()
</script>

<template>
  <router-link :class="props.isHere ? 'cursor-default' : ''" :to="props.path">
    <div
      class="rounded-3xl p-2"
      :class="props.isHere ? 'bg-zinc-200' : 'hover:bg-zinc-200'">
      <span>{{ props.text }}</span>
    </div>
  </router-link>
</template>
