<script setup lang="ts" generic="T extends string">
import { onMounted, onUnmounted, ref } from 'vue'

defineProps<{
  options: { key: string; value: T }[]
  currentValue: T
}>()

const emit = defineEmits<{
  (e: 'closeMenu'): void
  (e: 'selectOption', value: T): void
}>()

const handleSelectOption = (value: T) => {
  emit('selectOption', value)
}

const callback = () => {
  emit('closeMenu')
}

onMounted(() => {
  window.addEventListener('click', callback)
})
onUnmounted(() => {
  window.removeEventListener('click', callback)
})
</script>

<template>
  <div
    ref="containerRef"
    class="flex flex-col gap-2 rounded-md border bg-white p-2"
    @click.stop="">
    <div
      v-for="option in options"
      :key="option.value"
      class="rounded-sm p-1 hover:bg-hover-primary">
      <button
        class="h-full w-full text-left"
        type="button"
        @click="handleSelectOption(option.value)">
        {{ option.key }}
      </button>
    </div>
  </div>
</template>
