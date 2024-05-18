<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  modelValue: string
  options: Option[]
}
interface Option {
  key: string
  value: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-for="option in options" :key="option.key">
      <input v-model="value" class="mr-1" type="radio" :value="option.value" />
      {{ option.key }}
    </label>
  </div>
</template>
