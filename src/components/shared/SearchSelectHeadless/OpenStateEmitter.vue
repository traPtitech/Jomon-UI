<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'close' | 'open'): void
}>()

watch(
  () => props.open,
  (isOpen, wasOpen) => {
    if (!isOpen && wasOpen) {
      emit('close')
    } else if (isOpen && !wasOpen) {
      emit('open')
    }
  }
)
</script>

<template>
  <slot />
</template>
