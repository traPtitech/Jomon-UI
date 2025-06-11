<script lang="ts" setup>
import { useUserStore } from '/@/stores/user'
import type {
  RequestTargetDetail,
  RequestTarget
} from '/@/features/requestTarget/model'

import UserIcon from '/@/components/shared/UserIcon.vue'
import { RouterLink } from 'vue-router'
import InputSelectSingle from '/@/components/shared/InputSelectSingle.vue'
import InputNumber from '/@/components/shared/InputNumber.vue'
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
const { userMap, userOptions, isAdmin } = useUserStore()

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
    class="flex flex-wrap justify-between items-center gap-2 md:gap-0">
    <div class="flex items-center gap-1">
      <UserIcon class="w-10" :name="userMap[target.target]" />
      <div class="flex flex-col break-all gap-1">
        <div>{{ userMap[target.target] }}</div>
        <div>{{ target.amount }}円</div>
      </div>
    </div>
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
        class="text-blue-500 cursor-pointer"
        :disabled="isSending"
        @click="postTransactionFromRequest(request, target)">
        入出金記録を作成
      </button>
    </div>
  </div>
  <div v-else class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <InputSelectSingle
        v-model="targetModel.target"
        :options="targetOptions" />
      <div><InputNumber v-model="targetModel.amount" />円</div>
    </div>
    <div>
      <button @click="handleRemoveTarget">
        <TrashIcon class="w-6 text-error-primary cursor-pointer" />
      </button>
    </div>
  </div>
</template>
