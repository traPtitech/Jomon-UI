<script setup lang="ts">
import { computed, watch } from 'vue'

import type { ToastType } from './composables/useToast'

interface Props {
  shouldShowToast: boolean
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

watch(
  () => props.shouldShowToast,
  () => {
    setTimeout(() => {
      emit('remove')
    }, 3000)
  }
)
</script>

<template>
  <transition name="toast">
    <div
      :class="`top-17/20 left-4/5 absolute flex h-12 w-80 items-center justify-center rounded px-12 text-white opacity-90 ${backgroundColor}`">
      <slot />
    </div>
  </transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.6s ease-in-out;
}

.toast-enter-from {
  opacity: 0;
  transform: translate(20px, 0);
}
.toast-leave-to {
  opacity: 0;
  transform: translate(0, 40px);
}
</style>
