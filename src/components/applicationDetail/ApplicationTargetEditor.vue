<script lang="ts" setup>
import { computed } from 'vue'

import { TrashIcon } from '@heroicons/vue/24/solid'

import BaseNumberInput from '@/components/shared/BaseInput/BaseNumberInput.vue'
import SearchSelect from '@/components/shared/SearchSelect.vue'
import type { ApplicationDetail } from '@/features/application/entities'
import type { ApplicationTargetDetail } from '@/features/applicationTarget/entities'
import { useUserStore } from '@/features/user/store'

const props = defineProps<{
  application: ApplicationDetail
  selectedUserIds: string[]
}>()

const { userOptions } = useUserStore()

const targetOptions = computed(() =>
  userOptions.value.filter(
    user =>
      user.value === targetModel.value.target ||
      !props.selectedUserIds.includes(user.value)
  )
)

const targetModel = defineModel<ApplicationTargetDetail>('targetModel', {
  required: true,
})

const emit = defineEmits<(e: 'delete', id: string) => void>()

const targetAmountDraft = computed<number | null>({
  get: () => targetModel.value.amount,
  set: newAmount => {
    if (newAmount === null) return
    targetModel.value = {
      ...targetModel.value,
      amount: newAmount,
    }
  },
})

const handleRemoveTarget = () => {
  // TODO: confirmをカスタムモーダルに置き換える
  const result = confirm('本当に削除しますか？')
  if (!result) {
    return
  }

  emit('delete', targetModel.value.id)
  return
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex gap-1">
      <SearchSelect
        v-model="targetModel.target"
        :options="targetOptions"
        label="対象者" />
      <BaseNumberInput v-model="targetAmountDraft" label="金額" :min="0">
        <span class="mt-auto mb-2 ml-3 text-2xl font-bold text-text-secondary">
          ¥
        </span>
      </BaseNumberInput>
      <button @click="handleRemoveTarget">
        <TrashIcon class="w-6 cursor-pointer text-error-primary" />
      </button>
    </div>
  </div>
</template>
