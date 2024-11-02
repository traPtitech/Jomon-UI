<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Props {
  required?: boolean
  placeholder?: string
  min?: number
  autoFocus?: boolean
  id?: string
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
    :id="props.id"
    ref="inputRef"
    class="bg-surface-primary rounded border border-surface-secondary py-1 px-2 w-full"
    :min="props.min"
    :placeholder="props.placeholder"
    :required="props.required"
    type="number"
    :value="model"
    @input="handleInput(($event.target as HTMLInputElement).value)" />
</template>
