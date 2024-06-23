<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  type?: 'plain' | 'danger' | 'success'
  fontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  type: 'plain',
  disabled: false,
  fontSize: 'md',
  padding: 'md'
})

const typeClass = computed(() => {
  switch (props.type) {
    case 'plain':
      return `${!props.disabled && 'hover:bg-gray-200'} border-gray-300`
    case 'danger':
      return `${
        !props.disabled && 'hover:bg-red-300'
      } bg-red-500 border-red-300 text-white`
    case 'success':
      return `${
        !props.disabled && 'hover:bg-green-300'
      } bg-green-500 border-green-300 text-white`
    default:
      return `${!props.disabled && 'hover:bg-gray-200'} border-gray-300`
  }
})
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
    :class="`rounded-md border ${typeClass} ${fontSizeClass} ${paddingClass} ${
      props.disabled ? 'cursor-not-allowed opacity-50' : ''
    }`"
    :disabled="props.disabled"
    type="button">
    <slot />
  </button>
</template>
