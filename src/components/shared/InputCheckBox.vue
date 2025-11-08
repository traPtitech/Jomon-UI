<script setup lang="ts">
import { useTemplateRef, useId } from 'vue'

interface Props {
  label: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})

const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

const model = defineModel<boolean>({ required: true })

const inputId = useId()
</script>

<template>
  <div
    class="flex rounded-lg border border-surface-secondary bg-white !ring-offset-2 transition-all duration-200 ease-in-out focus-within:!ring-2 focus-within:!ring-blue-500 focus-within:outline-none">
    <slot />
    <div class="relative w-full">
      <input
        :id="inputId"
        ref="inputRef"
        :class="`peer w-full cursor-pointer border-none bg-transparent px-3 pt-2 pb-2 ring-0 outline-none`"
        :required="props.required"
        type="checkbox"
        v-model="model" />
      <label
        :for="inputId"
        :class="[
          'pointer-events-none absolute left-3 text-text-secondary transition-all duration-200 ease-in-out peer-focus:text-blue-500'
        ]">
        {{ props.label }}
        <span v-if="props.required" class="text-red-500">*</span>
      </label>
    </div>
  </div>
</template>
