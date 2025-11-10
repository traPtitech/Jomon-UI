<script lang="ts" setup>
import BaseNumberInput from '@/components/shared/BaseNumberInput.vue'
import SearchSelect from '@/components/shared/SearchSelect.vue'
import UserIcon from '@/components/shared/UserIcon.vue'
import type { ApplicationDetail } from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import type {
  ApplicationTarget,
  ApplicationTargetDetail
} from '@/features/applicationTarget/entities'
import { useUserStore } from '@/features/user/store'
import { TrashIcon } from '@heroicons/vue/24/solid'
import { computed } from 'vue'

const props = defineProps<{
  application: ApplicationDetail
  isEditMode: boolean
  target: ApplicationTargetDetail
}>()

const { userMap, userOptions } = useUserStore()
const { editApplication } = useApplicationStore()

const targets = computed(() =>
  props.application.targets.map(target => target.target)
)
const targetOptions = computed(() =>
  userOptions.value.filter(
    user =>
      user.value === props.target.target || !targets.value.includes(user.value)
  )
)

const targetModel = defineModel<ApplicationTarget>('targetModel', {
  required: true
})

const handleRemoveTarget = async () => {
  const result = confirm('本当に削除しますか？')
  if (!result) {
    return
  }

  try {
    await editApplication(props.application.id, {
      ...props.application,
      partition: props.application.partition.id,
      targets: props.application.targets.filter(
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
    class="flex flex-wrap items-center justify-between gap-2 md:gap-0">
    <div class="flex items-center gap-1">
      <UserIcon class="w-10" :name="userMap[target.target]" />
      <div class="flex flex-col gap-1 break-all">
        <div>{{ userMap[target.target] }}</div>
        <div>{{ target.amount }}円</div>
      </div>
    </div>
  </div>
  <div v-else class="flex items-center justify-between">
    <div class="flex gap-1">
      <SearchSelect
        v-model="targetModel.target"
        :options="targetOptions"
        label="対象者" />
      <BaseNumberInput v-model="targetModel.amount" label="金額">
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
