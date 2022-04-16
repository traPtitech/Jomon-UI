<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  fontSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  padding: 'sm' | 'md' | 'lg' | 'xl'
}
const props = defineProps<Props>()

const fontSizeClass = computed(() => {
  return 'text-' + props.fontSize
})
const paddingClass = computed(() => {
  switch (props.padding) {
    case 'sm':
      return 'py-1 px-2'
    case 'md':
      return 'py-2 px-4'
    case 'lg':
      return 'py-4 px-8'
    case 'xl':
      return 'py-8 px-16'
    default: {
      const n: never = props.padding
      throw new Error(`unexpected padding: ${n}`)
    }
  }
})
</script>

<template>
  <button
    :class="`hover:bg-gray-200 rounded-md border border-zinc-300 ${fontSizeClass} ${paddingClass}`">
    <slot></slot>
  </button>
</template>
