<script lang="ts" setup>
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/vue/24/solid'
import { computed } from 'vue'
import { useToast } from 'vue-toastification'

import { useUserStore } from '/@/stores/user'

import type { RequestTarget } from '/@/lib/apis'

import InputNumber from '/@/components/shared/InputNumber.vue'
import InputSelect from '/@/components/shared/InputSelect.vue'

interface Props {
  targets: RequestTarget[]
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'input', value: RequestTarget[]): void }>()

const userStore = useUserStore()
const toast = useToast()

const userOptions = computed(() =>
  userStore.userOptions.map(user => ({
    ...user,
    used: false
  }))
)
//todo:userOptionsNotUsedをtemplate内ではなくてここに書く。computedだとなぜか上手くいかなかった

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
    // 既に選択されているユーザーを選択できないようにする
    userOptions.value.forEach(user => {
      if (
        props.targets
          .map((target, i) => (i === index ? requestTarget : target))
          .some(target => target.target === user.value)
      ) {
        user.used = true
      } else {
        user.used = false
      }
    })
    return
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
  if (props.targets.length === 1) {
    toast.warning('払い戻し対象者は1人以上必要です')
  }
  emit(
    'input',
    props.targets.filter((_, i) => i !== index)
  )
}
</script>

<template>
  <div class="flex flex-col">
    <label>払い戻し対象者</label>
    <ul>
      <li
        v-for="(target, i) in targets"
        :key="target.target"
        class="mb-2 flex w-2/3 items-center gap-4">
        <InputSelect
          class="!w-1/3 flex-grow"
          :model-value="target.target"
          :options="
            userOptions
              .filter(user => !user.used)
              .map(user => ({
                key: user.key,
                value: user.value
              }))
          "
          placeholder="払い戻し対象者を選択"
          @update:model-value="handleEditTarget(i, $event)" />
        <div>
          <InputNumber
            class="mr-1"
            :min="1"
            :model-value="target.amount"
            placeholder="金額"
            @update:model-value="handleEditTarget(i, $event)" />円
        </div>
        <button class="flex" @click="handleRemoveTarget(i)">
          <MinusCircleIcon class="w-6" />
        </button>
      </li>
    </ul>
    <div
      v-if="
        userOptions
          .filter(user => !user.used)
          .map(user => ({
            key: user.key,
            value: user.value
          })).length > 0
      "
      class="w-2/3 text-center">
      <button @click="handleAddTarget">
        <PlusCircleIcon class="w-8" />
      </button>
    </div>
  </div>
</template>
