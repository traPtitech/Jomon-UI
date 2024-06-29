<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

const textareaRef = ref<HTMLTextAreaElement | null>(null)

function handleInput(value: string) {
  model.value = value
}

onMounted(() => {
  if (props.autoFocus) {
    if (textareaRef.value === null) return
    textareaRef.value.focus()
  }
})
</script>

<template>
  <textarea
    ref="textareaRef"
    class="bg-background min-h-32 rounded border border-gray-300 px-3 py-2"
    :placeholder="props.placeholder"
    :required="required"
    :value="model"
    @input="handleInput(($event.target as HTMLTextAreaElement).value)" />
</template>
