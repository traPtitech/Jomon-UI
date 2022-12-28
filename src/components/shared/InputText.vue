<script setup lang="ts">
interface Props {
  modelValue: string
  required?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})
const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string): void
}>()

function handleInput(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <input
    class="bg-background rounded border border-gray-300 py-1 px-2 disabled:cursor-not-allowed disabled:bg-gray-200"
    :placeholder="props.placeholder"
    :required="props.required"
    :value="props.modelValue"
    @change="handleInput(($event.target as HTMLInputElement).value)" />
</template>
