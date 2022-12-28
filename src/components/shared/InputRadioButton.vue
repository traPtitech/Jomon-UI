<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  modelValue: string
  options: Option[]
  disabled?: boolean
}
interface Option {
  key: string
  value: string
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<template>
  <div class="space-x-4">
    <label v-for="option in options" :key="option.key">
      <input
        v-model="value"
        class="disabled:cursor-not-allowed"
        :disabled="disabled"
        type="radio"
        :value="option.value" />
      {{ option.key }}
    </label>
  </div>
</template>
