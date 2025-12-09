<script lang="ts" setup>
interface Option<T> {
  key: string
  value: T
}

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
