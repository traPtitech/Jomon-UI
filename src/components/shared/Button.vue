<script lang="ts" setup>
type Props = {
  fontSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  padding: 'sm' | 'md' | 'lg' | 'xl'
}
const props = defineProps<Props>()
const fontSize = (() => {
  return 'text-' + props.fontSize
})()
const padding = (() => {
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
})()
</script>

<template>
  <button
    :class="`hover:bg-zinc-200 rounded-md border border-zinc-300' ${fontSize} ${padding}`"
  >
    <slot></slot>
  </button>
</template>
