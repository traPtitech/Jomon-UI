<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  label: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})

// v-model (boolean) を受ける
const model = defineModel<boolean>({ required: true })

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  model.value = target.checked
}

const checkedForCheckbox = computed(() => model.value)
</script>

<template>
  <div
    class="flex rounded-lg border border-surface-secondary bg-white !ring-offset-2 transition-all duration-200 ease-in-out focus-within:!ring-2 focus-within:!ring-blue-500 focus-within:outline-none">
    <slot />
    <div class="relative w-full">
      <input
        :id="`input-${props.label}`"
        ref="inputRef"
        :class="`peer w-full border-none bg-transparent px-3 pt-2 pb-2 ring-0 outline-none`"
        :required="props.required"
        type="checkbox"
        :checked="checkedForCheckbox"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur" />
      <label
        :for="`input-${props.label}`"
        :class="[
          'pointer-events-none absolute left-3 text-text-secondary transition-all duration-200 ease-in-out peer-focus:text-blue-500'
        ]">
        {{ props.label }}
        <span v-if="props.required" class="text-red-500">*</span>
      </label>
    </div>
  </div>
</template>
