<script lang="ts" setup>
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import BaseInput from '@/components/shared/BaseInput.vue'
import SearchSelect from '@/components/shared/SearchSelect.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { ApplicationTargetInput } from '@/lib/apis'
import { useUserStore } from '@/features/user/store'

const model = defineModel<ApplicationTargetInput[]>({ required: true })

const { userOptions } = useUserStore()

function handleAddTarget() {
  model.value = [...model.value, { target: '', amount: 0 }]
}
function handleRemoveTarget(index: number) {
  model.value = model.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <ul class="flex flex-col gap-2">
      <li v-for="(target, i) in model" :key="target.target" class="flex gap-3">
        <SearchSelect
          v-model="target.target"
          :options="userOptions"
          class="grow"
          label="払い戻し対象者" />
        <BaseInput v-model="target.amount" type="number" label="金額">
          <span
            class="text-2xl font-bold ml-3 mt-auto mb-2 text-text-secondary">
            ¥
          </span>
        </BaseInput>
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
        <PlusIcon class="w-5 mr-2" />
        払い戻し対象者を追加
      </SimpleButton>
    </div>
  </div>
</template>
