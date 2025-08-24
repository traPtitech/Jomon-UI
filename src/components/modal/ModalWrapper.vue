<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<(e: 'closeModal') => void>()

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && isAnyFocused.value === false) {
    emit('closeModal')
    
  }
}

const isAnyFocused = ref(false)

const updateFocusState = () => {
  const active = document.activeElement
  isAnyFocused.value = active && active.tagName === "TEXTAREA"
}

onMounted(() => {
  window.addEventListener("focusin", updateFocusState)
  window.addEventListener("focusout", updateFocusState)
})

onUnmounted(() => {
  window.removeEventListener("focusin", updateFocusState)
  window.removeEventListener("focusout", updateFocusState)
})

</script>

<template>
  <teleport to="body">
    <div
      role="button"
      tabindex="0"
      aria-label="モーダルを閉じる"
      className="z-10 fixed top-0 left-0 h-full w-full bg-surface-secondary/50"
      @click.self="emit('closeModal')"
      @keydown="handleKeydown">
      <slot />
    </div>
  </teleport>
</template>
