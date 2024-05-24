<script lang="ts" setup>
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'

import { useUserStore } from '/@/stores/user'

import type { RequestTarget } from '/@/lib/apis'

import InputNumber from '/@/components/shared/InputNumber.vue'
import InputSelectSingle from '/@/components/shared/InputSelectSingle.vue'

interface Props {
  targets: RequestTarget[]
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'input', value: RequestTarget[]): void }>()

const userStore = useUserStore()
const { userOptions } = storeToRefs(userStore)

function handleEditTarget(index: number, value: unknown) {
  if (typeof value === 'string') {
    const requestTarget = {
      target: value,
      amount: props.targets[index].amount
    }
    emit(
      'input',
      props.targets.map((target, i) => (i === index ? requestTarget : target))
    )
  }
  if (typeof value === 'number') {
    const requestTarget = {
      target: props.targets[index].target,
      amount: value
    }
    emit(
      'input',
      props.targets.map((target, i) => (i === index ? requestTarget : target))
    )
    return
  }
}

function handleAddTarget() {
  emit('input', [...props.targets, { target: '', amount: 0 }])
}
function handleRemoveTarget(index: number) {
  emit(
    'input',
    props.targets.filter((_, i) => i !== index)
  )
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <label class="text-xl" for="target">払い戻し対象者</label>
    <ul class="flex flex-col gap-2">
      <li
        v-for="(target, i) in targets"
        :key="target.target"
        class="flex items-center gap-3">
        <InputSelectSingle
          :id="i === targets.length - 1 ? 'target' : undefined"
          class="flex-grow"
          :model-value="target.target"
          :options="userOptions"
          placeholder="払い戻し対象者を選択"
          @update:model-value="handleEditTarget(i, $event)" />
        <div>
          <InputNumber
            class="mr-2"
            :min="1"
            :model-value="target.amount"
            placeholder="金額"
            @update:model-value="handleEditTarget(i, $event)" />円
        </div>
        <button
          v-if="targets.length > 1"
          class="flex"
          @click="handleRemoveTarget(i)">
          <TrashIcon class="w-6 text-red-400" />
        </button>
      </li>
    </ul>
    <div v-if="userOptions.length > targets.length" class="ml-3">
      <button
        class="flex items-center p-2 border rounded text-base"
        @click="handleAddTarget">
        <PlusIcon class="w-5 mr-2" />
        払い戻し対象者を追加
      </button>
    </div>
  </div>
</template>
