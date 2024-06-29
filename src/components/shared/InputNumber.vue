<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  required?: boolean
  placeholder?: string
  min?: number
  autoFocus?: boolean
}
const model = defineModel<number>({ required: true })
const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: '',
  min: 0,
  autoFocus: false
})
const inputRef = ref<HTMLInputElement | null>(null)

function handleInput(value: string) {
  model.value = Number(value)
}

onMounted(() => {
  if (props.autoFocus) {
    if (inputRef.value === null) return
    inputRef.value.focus()
  }
})
</script>

<template>
  <input
    ref="inputRef"
    class="bg-background rounded border border-gray-300 py-1 px-2"
    :min="props.min"
    :placeholder="props.placeholder"
    :required="props.required"
    type="number"
    :value="model"
    @input="handleInput(($event.target as HTMLInputElement).value)" />
</template>
