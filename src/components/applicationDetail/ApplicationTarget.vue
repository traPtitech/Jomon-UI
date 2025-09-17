<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/solid'
import { computed } from 'vue'
import BaseInput from '@/components/shared/BaseInput.vue'
import SearchSelect from '@/components/shared/SearchSelect.vue'
import UserIcon from '@/components/shared/UserIcon.vue'
import type { ApplicationDetail } from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import type {
  ApplicationTarget,
  ApplicationTargetDetail
} from '@/features/applicationTarget/entities'
import { useUserStore } from '@/features/user/store'

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
      partition: props.application.partition?.id ?? null,
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
    class="flex flex-wrap justify-between items-center gap-2 md:gap-0">
    <div class="flex items-center gap-1">
      <UserIcon class="w-10" :name="userMap[target.target]" />
      <div class="flex flex-col break-all gap-1">
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
      <BaseInput v-model="targetModel.amount" type="number" label="金額">
        <span class="text-2xl font-bold ml-3 mt-auto mb-2 text-text-secondary">
          ¥
        </span>
      </BaseInput>
      <button @click="handleRemoveTarget">
        <TrashIcon class="w-6 text-error-primary cursor-pointer" />
      </button>
    </div>
  </div>
</template>
