<script setup lang="ts">
import { computed, watch } from 'vue'

import { useToastStore } from '/@/stores/toast'

const toastStore = useToastStore()

const backgroundColor = computed(() => {
  switch (toastStore.toastType) {
    case 'success':
      return 'bg-emerald-400'
    case 'error':
      return 'bg-red-400'
    default: {
      const check: never = toastStore.toastType
      throw new Error(`unexpected type: ${check}`)
    }
  }
})

watch(
  () => toastStore.shouldShowToast,
  shouldShowToast => {
    if (!shouldShowToast) {
      return
    }
    setTimeout(() => {
      toastStore.removeToast()
    }, 3000)
  }
)
</script>

<template>
  <transition name="toast">
    <div
      :class="`top-17/20 left-4/5 absolute flex h-12 w-80 items-center justify-center rounded px-12 text-white opacity-90 ${backgroundColor}`">
      {{ toastStore.toastMessage }}
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
