<script lang="ts" setup>
type Props = {
  class?: string
  text:
    | 'text-xs'
    | 'text-sm'
    | 'text-md'
    | 'text-lg'
    | 'text-xl'
    | 'text-2xl'
    | 'text-3xl'
  padding: 'sm' | 'md' | 'lg' | 'xl'
}
interface Emits {
  (e: 'onClick'): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emits>()
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
    @click="emit('onClick')"
    :class="
      'hover:bg-zinc-200 rounded-lg border border-zinc-300 border-2 ' +
      props.class +
      ' ' +
      props.text +
      ' ' +
      padding()
    "
  >
    <slot></slot>
  </button>
</template>
