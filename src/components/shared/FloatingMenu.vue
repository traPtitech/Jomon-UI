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

const containerRef = ref<HTMLDivElement | null>(null)

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
    class="bg-white rounded-md p-2 flex flex-col gap-2 border"
    @click.stop="">
    <div
      v-for="option in options"
      :key="option.value"
      class="hover:bg-hover-primary rounded-sm p-1">
      <button
        class="w-full h-full text-left"
        type="button"
        @click="handleSelectOption(option.value)">
        {{ option.key }}
      </button>
    </div>
  </div>
</template>
