<script setup lang="ts">
import { onMounted } from 'vue'

import type { ToastType } from './composables/useToast'

interface Props {
  type: ToastType
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'remove'): void }>()

onMounted(() => {
  setTimeout(() => {
    emit('remove')
  }, 3000)
})
</script>

<template>
  <div
    :class="`top-17/20 left-4/5 absolute flex h-12 w-80 items-center justify-center rounded px-12 text-white opacity-90 ${
      props.type === 'success' ? 'bg-emerald-400' : 'bg-red-400'
    }`">
    <slot />
  </div>
</template>
