<script setup lang="ts">
const emit = defineEmits<{
  (e: 'closeModal'): void
}>()
</script>

<template>
  <div
    className="z-10 fixed top-0 left-0 h-full w-full bg-gray-300/50"
    @click.self="emit('closeModal')">
    <slot />
  </div>
</template>
