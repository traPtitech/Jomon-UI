<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useUserStore } from '/@/stores/user'
import type {
  RequestTargetDetail,
  RequestTarget
} from '/@/features/requestTarget/model'

import UserIcon from '/@/components/shared/UserIcon.vue'
import { RouterLink } from 'vue-router'
import BaseInput from '/@/components/shared/BaseInput.vue'
import SearchSelect from '/@/components/shared/SearchSelect.vue'
import { TrashIcon } from '@heroicons/vue/24/solid'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import type { RequestDetail } from '/@/features/request/model'

import { useNewTransaction } from '/@/pages/composables/useNewTransaction'
import { computed } from 'vue'
import { editRequestUsecase } from '/@/features/request/usecase'

const props = defineProps<{
  request: RequestDetail
  isEditMode: boolean
  target: RequestTargetDetail
}>()

const { isSending, postTransactionFromRequest } = useNewTransaction()
const userStore = useUserStore()
const { userMap, userOptions, isAdmin } = storeToRefs(userStore)

const targets = computed(() =>
  props.request.targets.map(target => target.target)
)
const targetOptions = computed(() =>
  userOptions.value.filter(
    user =>
      user.value === props.target.target || !targets.value.includes(user.value)
  )
)

const targetModel = defineModel<RequestTarget>('targetModel', {
  required: true
})

const handleRemoveTarget = async () => {
  const result = confirm('本当に削除しますか？')
  if (!result) {
    return
  }

  try {
    await editRequestUsecase(props.request.id, {
      ...props.request,
      group: props.request.group?.id ?? null,
      targets: props.request.targets.filter(
        target => target.target !== props.target.target
      )
    })
  } catch {
    alert('削除に失敗しました')
  }
}
</script>

<template>
  <div
    v-if="!props.isEditMode"
    class="grid grid-cols-[3fr_1fr_2fr] items-center">
    <div class="flex items-center gap-1">
      <UserIcon class="w-10" :name="userMap[target.target]" />
      <div class="break-all">{{ userMap[target.target] }}</div>
    </div>
    <div>{{ target.amount }}円</div>
    <div>
      <!--TODO: targetのレスポンスにtransactionのidを入れてもらう-->
      <div v-if="target.paidAt !== null" class="flex items-center gap-2">
        払い戻し済み
        <RouterLink
          class="underline"
          title="入出金記録へ"
          :to="`/transactions/`">
          <ArrowTopRightOnSquareIcon class="w-6" />
        </RouterLink>
      </div>
      <button
        v-else-if="isAdmin"
        class="text-blue-500"
        :disabled="isSending"
        @click="postTransactionFromRequest(request, target)">
        入出金記録を作成
      </button>
    </div>
  </div>
  <div v-else class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <SearchSelect
        v-model="targetModel.target"
        :options="targetOptions"
        label="対象者" />
      <BaseInput v-model="targetModel.amount" type="number" label="金額">
        <span class="text-2xl font-bold ml-3 mt-auto mb-2 text-text-secondary">
          ¥
        </span>
      </BaseInput>
    </div>
    <div>
      <button @click="handleRemoveTarget">
        <TrashIcon class="w-6 text-error-primary cursor-pointer" />
      </button>
    </div>
  </div>
</template>
