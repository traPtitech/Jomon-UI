<script lang="ts" setup>
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'

import type { ApplicationTargetDraft } from '@/components/applicationDetail/types'
import BaseNumberInput from '@/components/shared/BaseInput/BaseNumberInput.vue'
import SearchSelect from '@/components/shared/SearchSelect/SearchSelect.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { useUserStore } from '@/features/user/store'

const model = defineModel<ApplicationTargetDraft[]>({ required: true })

const { userOptions } = useUserStore()

function handleAddTarget() {
  model.value = [...model.value, { target: null, amount: null }]
}
function handleRemoveTarget(index: number) {
  model.value = model.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <ul class="flex flex-col gap-2">
      <li v-for="(target, i) in model" :key="i" class="flex gap-3">
        <SearchSelect
          v-model="target.target"
          :options="userOptions"
          class="grow"
          label="払い戻し対象者" />
        <BaseNumberInput v-model="target.amount" label="金額" :min="0">
          <span
            class="mt-auto mb-2 ml-3 text-2xl font-bold text-text-secondary">
            ¥
          </span>
        </BaseNumberInput>
        <button
          v-if="model.length > 1"
          aria-label="払い戻し対象者を削除"
          class="flex"
          type="button"
          @click="handleRemoveTarget(i)">
          <TrashIcon class="w-6 text-error-primary" />
        </button>
      </li>
    </ul>
    <div v-if="userOptions.length > model.length" class="ml-3">
      <SimpleButton font-size="base" padding="sm" @click="handleAddTarget">
        <PlusIcon class="mr-2 w-5" />
        払い戻し対象者を追加
      </SimpleButton>
    </div>
  </div>
</template>
