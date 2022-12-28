<script lang="ts" setup>
import { computed } from 'vue'

import VueSelect from '/@/components/shared/VueSelect.vue'

interface Props {
  modelValue: Props['options'][number]['value']
  options: Option[]
  placeholder: string
  isMultiple?: boolean
  disabled?: boolean
}
interface Option {
  key: string
  value: unknown
}
const props = withDefaults(defineProps<Props>(), {
  isMultiple: false,
  disabled: false
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: Props['modelValue']): void
}>()
const value = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<template>
  <VueSelect
    v-model="value"
    class="w-70"
    :close-on-select="!props.isMultiple"
    deselect-from-dropdown
    :disabled="props.disabled"
    label="key"
    :multiple="props.isMultiple"
    :options="props.options"
    :placeholder="props.placeholder"
    :reduce="(option: Option) => option.value" />
</template>
