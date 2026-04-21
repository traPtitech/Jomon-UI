<script lang="ts" setup>
import { computed } from 'vue'

import { TrashIcon } from '@heroicons/vue/24/solid'
import { useToast } from 'vue-toastification'

import BaseNumberInput from '@/components/shared/BaseInput/BaseNumberInput.vue'
import SearchSelect from '@/components/shared/SearchSelect.vue'
import type { ApplicationDetail } from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import type { ApplicationTargetDetail } from '@/features/applicationTarget/entities'
import { useUserStore } from '@/features/user/store'

const props = defineProps<{
  application: ApplicationDetail
  isEditMode: boolean
  target: ApplicationTargetDetail
  selectedUserIds: string[]
}>()

const { userOptions } = useUserStore()
const { editApplication } = useApplicationStore()
const toast = useToast()

const targetOptions = computed(() =>
  userOptions.value.filter(
    user =>
      user.value === props.target.target ||
      !props.selectedUserIds.includes(user.value)
  )
)

const targetModel = defineModel<ApplicationTargetDetail>('targetModel', {
  required: true,
})

const emit = defineEmits<(e: 'delete', id: string) => void>()

const targetAmountDraft = computed<number | null>({
  get: () => props.target.amount,
  set: newAmount => {
    if (newAmount === null) return
    targetModel.value = {
      ...targetModel.value,
      amount: newAmount,
    }
  },
})

const handleRemoveTarget = async () => {
  // TODO: confirmをカスタムモーダルに置き換える
  const result = confirm('本当に削除しますか？')
  if (!result) {
    return
  }

  // 編集モード中はローカル削除のみ（親で処理）
  if (props.isEditMode) {
    emit('delete', props.target.id)
    return
  }

  // 表示モードでは即座にAPI呼び出し
  try {
    await editApplication(props.application.id, {
      ...props.application,
      partition: props.application.partition.id,
      targets: props.application.targets.filter(
        target => target.id !== props.target.id
      ),
    })
  } catch {
    toast.error('削除に失敗しました')
  }
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
