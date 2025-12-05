<script setup lang="ts">
const emit = defineEmits<(e: 'closeModal') => void>()

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('closeModal')
  }
}
</script>

<template>
  <teleport to="body">
    <div
      role="button"
      tabindex="0"
      aria-label="モーダルを閉じる"
      class="fixed top-0 left-0 z-10 h-full w-full bg-surface-secondary/50"
      @click.self="emit('closeModal')"
      @keydown="handleKeydown">
      <slot />
    </div>
  </teleport>
</template>
