<script setup lang="ts">
const emit = defineEmits<{
  (e: 'closeModal'): void
}>()
</script>

<template>
  <teleport to="body">
    <div
      class="fixed top-0 left-0 z-10 h-full w-full bg-gray-300/50"
      @click.self="emit('closeModal')">
      <slot />
    </div>
  </teleport>
</template>
