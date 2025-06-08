<script lang="ts" setup>
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import InputText from '/@/components/shared/InputText.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

const targets = defineModel<string[]>('targets', { required: true })

const handleEditTarget = (index: number, value: string) => {
  targets.value[index] = value
}

const handleAddTarget = () => {
  targets.value.push('')
}
const handleRemoveTarget = (index: number) => {
  targets.value.splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium" for="target">取引相手</label>
    <ul class="flex flex-col gap-2">
      <li
        v-for="(target, i) in targets"
        :key="i"
        class="flex items-center gap-3">
        <InputText
          class="grow"
          :model-value="target"
          placeholder="取引相手"
          @update:model-value="handleEditTarget(i, $event)" />
        <button
          v-if="targets.length > 1"
          class="flex"
          type="button"
          @click="handleRemoveTarget(i)">
          <TrashIcon class="w-6 text-error-primary" />
        </button>
      </li>
    </ul>
    <div class="ml-3">
      <SimpleButton font-size="base" padding="sm" @click="handleAddTarget">
        <PlusIcon class="w-5 mr-2" />
        取引相手を追加
      </SimpleButton>
    </div>
  </div>
</template>
