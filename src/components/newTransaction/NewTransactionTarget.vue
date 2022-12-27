<script lang="ts" setup>
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/vue/24/solid'
import { useToast } from 'vue-toastification'

import InputText from '/@/components/shared/InputText.vue'

interface Props {
  targets: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'input', value: string[]): void }>()

const toast = useToast()

function handleEditTarget(index: number, value: string) {
  emit(
    'input',
    props.targets.map((target, i) => (i === index ? value : target))
  )
}

function handleAddTarget() {
  emit('input', [...props.targets, ''])
}
function handleRemoveTarget(index: number) {
  if (props.targets.length === 1) {
    toast.warning('取引相手は1人以上必要です')
    return
  }
  emit(
    'input',
    props.targets.filter((_, i) => i !== index)
  )
}
</script>

<template>
  <div class="flex flex-col">
    <label>取引相手</label>
    <ul>
      <li
        v-for="(target, i) in targets"
        :key="target"
        class="mb-2 flex w-2/3 items-center gap-4">
        <InputText
          :model-value="target"
          placeholder="取引相手"
          @update:model-value="handleEditTarget(i, $event)" />
        <button class="flex" @click="handleRemoveTarget(i)">
          <MinusCircleIcon class="w-6" />
        </button>
      </li>
    </ul>
    <div class="w-2/3 text-center">
      <button @click="handleAddTarget">
        <PlusCircleIcon class="w-8" />
      </button>
    </div>
  </div>
</template>
