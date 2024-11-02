<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Props {
  required?: boolean
  placeholder?: string
  autoFocus?: boolean
  id?: string
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
    :id="props.id"
    ref="textareaRef"
    class="bg-surface-primary min-h-32 rounded border border-surface-secondary px-3 py-2"
    :placeholder="props.placeholder"
    :required="required"
    :value="model"
    @input="handleInput(($event.target as HTMLTextAreaElement).value)" />
</template>
