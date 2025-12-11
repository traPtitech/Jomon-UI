<script lang="ts" setup>
import { computed, ref } from 'vue'

import { useToast } from 'vue-toastification'

import ApplicationTarget from '@/components/applicationDetail/ApplicationTarget.vue'
import EditButton from '@/components/shared/EditButton.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { useApplication } from '@/features/application/composables'
import type { ApplicationDetail } from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import type { ApplicationTargetEditDraft } from '@/features/applicationTarget/entities'
import { useUserStore } from '@/features/user/store'

const props = defineProps<{
  application: ApplicationDetail
}>()

const { me } = useUserStore()
const { isApplicationCreator } = useApplication(props.application)
const { editApplication } = useApplicationStore()
const toast = useToast()

const hasAuthority = isApplicationCreator.value(me.value)

const isEditMode = ref(false)
const editedTargets = ref<ApplicationTargetEditDraft[]>(
  props.application.targets.map(t => ({ ...t }))
)

const selectedUserIds = computed(() => {
  const targets = isEditMode.value
    ? editedTargets.value
    : props.application.targets
  return targets
    .map(t => t.target)
    .filter((t): t is string => t !== null && t !== '')
})

const handleDeleteTarget = (id: string) => {
  editedTargets.value = editedTargets.value.filter(target => target.id !== id)
}

const toggleEditTargets = () => {
  editedTargets.value = props.application.targets.map(t => ({ ...t }))
  isEditMode.value = !isEditMode.value
}

const handleUpdateTargets = async () => {
  const targets = editedTargets.value
  const hasEmptyTargets = targets.some(
    target => !target.target || target.amount === null
  )

  if (hasEmptyTargets) {
    toast.error('払い戻し対象者と金額を入力してください')
    return
  }

  // Type Guard / Conversion: We verified all targets are filled.
  // We can safely cast or map to strict structure if necessary, but ApplicationSeed/Detail usage might require strict types.
  // editedTargets is ApplicationTargetEditDraft. API expects strict types likely.
  const validTargets = targets.map(t => ({
    id: t.id,
    target: t.target as string,
    amount: t.amount as number,
  }))

  try {
    await editApplication(props.application.id, {
      ...props.application,
      partition: props.application.partition.id,
      targets: validTargets, // Pass validated strict targets
    })
    toast.success('更新しました')
  } catch {
    toast.error('更新に失敗しました')
  }
  isEditMode.value = false
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-bold">払い戻し対象者</h2>
      <div class="flex items-center gap-2">
        <SimpleButton
          v-if="isEditMode"
          font-size="base"
          padding="sm"
          @click="handleUpdateTargets">
          完了
        </SimpleButton>
        <EditButton
          v-if="hasAuthority"
          :is-edit-mode="isEditMode"
          @click="toggleEditTargets" />
      </div>
    </div>
    <div v-if="application" class="flex flex-col gap-2">
      <template v-if="isEditMode">
        <div v-for="(target, i) in editedTargets" :key="target.id">
          <ApplicationTarget
            v-if="editedTargets[i]"
            v-model:target-model="editedTargets[i]"
            :is-edit-mode="isEditMode"
            :application="application"
            :target="target"
            :selected-user-ids="selectedUserIds"
            @delete="handleDeleteTarget" />
        </div>
      </template>
      <template v-else>
        <ApplicationTarget
          v-for="target in application.targets"
          :key="target.id"
          :is-edit-mode="isEditMode"
          :application="application"
          :target="target"
          :target-model="target"
          :selected-user-ids="selectedUserIds" />
      </template>
    </div>
  </div>
</template>
