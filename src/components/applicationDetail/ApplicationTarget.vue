<script lang="ts" setup generic="T extends ApplicationTargetEditDraft">
import { computed } from 'vue'

import { TrashIcon } from '@heroicons/vue/24/solid'
import { useToast } from 'vue-toastification'

import type { ApplicationTargetEditDraft } from '@/components/applicationDetail/types'
import BaseNumberInput from '@/components/shared/BaseInput/BaseNumberInput.vue'
import SearchSelect from '@/components/shared/SearchSelect/SearchSelect.vue'
import UserIcon from '@/components/shared/UserIcon.vue'
import type { ApplicationDetail } from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import type { ApplicationTargetDetail } from '@/features/applicationTarget/entities'
import { useUserStore } from '@/features/user/store'

const props = defineProps<{
  application: ApplicationDetail
  isEditMode: boolean
  target: ApplicationTargetDetail | ApplicationTargetEditDraft
  selectedUserIds: string[]
}>()

const { getUserName, getUserNameWithFallback, userOptions } = useUserStore()
const { editApplication } = useApplicationStore()
const toast = useToast()

const targetOptions = computed(() =>
  userOptions.value.filter(
    user =>
      user.key === props.target.target ||
      !props.selectedUserIds.includes(user.key)
  )
)

const targetModel = defineModel<T>('targetModel', { required: true })

const amountModel = computed<number | null>({
  get: () => targetModel.value.amount,
  set: (val: number | null) => {
    targetModel.value.amount = val ?? 0
  },
})

const emit = defineEmits<(e: 'delete', id: string) => void>()

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
  <div
    v-if="!props.isEditMode"
    class="flex flex-wrap items-center justify-between gap-2 md:gap-0">
    <div class="flex items-center gap-1">
      <UserIcon class="w-10" :name="getUserName(target.target ?? '')" />
      <div class="flex flex-col gap-1 break-all">
        <div>{{ getUserNameWithFallback(target.target ?? '') }}</div>
        <div>{{ target.amount }}円</div>
      </div>
    </div>
  </div>
  <div v-else-if="targetModel" class="flex items-center justify-between">
    <div class="flex gap-1">
      <SearchSelect
        v-model="targetModel.target"
        :options="targetOptions"
        label="対象者" />
      <BaseNumberInput v-model="amountModel" label="金額" :min="0">
        <span class="mt-auto mb-2 ml-3 text-2xl font-bold text-text-secondary">
          ¥
        </span>
      </BaseNumberInput>
      <button @click="handleRemoveTarget">
        <TrashIcon class="w-6 cursor-pointer text-error-primary" />
      </button>
    </div>
  </div>
  <div v-else class="text-error-primary">
    [エラー] 対象者データの読み込みに失敗しました
  </div>
</template>
