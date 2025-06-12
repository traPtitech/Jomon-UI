<script lang="ts" setup>
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import BaseInput from '/@/components/shared/BaseInput.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

const targets = defineModel<string[]>('targets', { required: true })

const handleAddTarget = () => {
  targets.value.push('')
}
const handleRemoveTarget = (index: number) => {
  targets.value.splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <ul class="flex flex-col gap-2">
      <li v-for="(_, i) in targets" :key="i" class="flex items-center gap-3">
        <BaseInput
          v-model="targets[i]"
          label="取引相手"
          class="grow"
          required />
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
