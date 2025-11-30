<script lang="ts" setup>
import type { Option } from './types'

interface Props {
  options: Option<string>[]
}
const model = defineModel<string>({ required: true })
const props = defineProps<Props>()
</script>

<template>
  <div class="flex gap-4">
    <label
      v-for="option in props.options"
      :key="option.key"
      class="cursor-pointer">
      <input v-model="model" type="radio" :value="option.value" />
      {{ option.key }}
    </label>
  </div>
</template>
