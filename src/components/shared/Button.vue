<script lang="ts" setup>
type Props = {
  class?: string
  fontSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  padding: 'sm' | 'md' | 'lg' | 'xl'
}
interface Emits {
  (e: 'onClick'): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const fontSize = () => {
  return 'text-' + props.fontSize
}
const padding = () => {
  switch (props.padding) {
    case 'sm':
      return 'p-1'
    case 'md':
      return 'p-2'
    case 'lg':
      return 'p-4'
    case 'xl':
      return 'p-8'
  }
}
</script>
<template>
  <button
    :class="
      'hover:bg-zinc-200 rounded-lg border border-zinc-300 border-2 bg-zinc-100 ' +
      props.class +
      ' ' +
      fontSize() +
      ' ' +
      padding()
    "
    @click="emit('onClick')">
    <slot></slot>
  </button>
</template>
