<script setup lang="ts">
import { onMounted, computed } from 'vue'

import type { ToastType } from './composables/useToast'

interface Props {
  type: ToastType
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'remove'): void }>()

const backgroundColor = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-emerald-400'
    case 'error':
      return 'bg-red-400'
    default: {
      const check: never = props.type
      throw new Error(`unexpected type: ${check}`)
    }
  }
})

onMounted(() => {
  setTimeout(() => {
    emit('remove')
  }, 3000)
})
</script>

<template>
  <div
    :class="`top-17/20 left-4/5 absolute flex h-12 w-80 items-center justify-center rounded px-12 text-white opacity-90 ${backgroundColor}`">
    <slot />
  </div>
</template>
