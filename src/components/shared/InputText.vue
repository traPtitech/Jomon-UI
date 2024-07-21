<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Props {
  required?: boolean
  placeholder?: string
  autoFocus?: boolean
}

const model = defineModel<string>({ required: true })
const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: '',
  autoFocus: false
})
const inputRef = ref<HTMLInputElement | null>(null)

function handleInput(value: string) {
  model.value = value
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
    class="bg-white rounded border border-secondary py-1 px-2"
    :placeholder="props.placeholder"
    :required="props.required"
    :value="model"
    @input="handleInput(($event.target as HTMLInputElement).value)" />
</template>
