<script lang="ts" setup>
import { computed } from 'vue'

import VueSelect from '/@/components/shared/VueSelect.vue'

interface Props {
  modelValue: any
  options: Option[]
  placeholder: string
  isMultiple?: boolean
}
interface Option {
  key: string
  value: any
}
const props = withDefaults(defineProps<Props>(), {
  isMultiple: false
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
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
    label="key"
    :multiple="props.isMultiple"
    :options="props.options"
    :placeholder="props.placeholder"
    :reduce="(option: Option) => option.value" />
</template>
