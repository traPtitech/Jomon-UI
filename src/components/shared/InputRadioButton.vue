<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  modelValue: any
  options: Option[]
}
interface Option {
  key: string
  value: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<template>
  <div class="space-x-4">
    <label v-for="option in options" :key="option.key">
      <input v-model="value" type="radio" :value="option.value" />
      {{ option.key }}
    </label>
  </div>
</template>
