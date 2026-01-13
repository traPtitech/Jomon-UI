<script lang="ts" setup>
import { computed, ref } from 'vue'

import { useToast } from 'vue-toastification'

import ApplicationTarget from '@/components/applicationDetail/ApplicationTarget.vue'
import EditButton from '@/components/shared/EditButton.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { useApplication } from '@/features/application/composables'
import { useApplicationStore } from '@/features/application/store'
import type { ApplicationTargetDetail } from '@/features/applicationTarget/entities'
import { useUserStore } from '@/features/user/store'

import type { ApplicationEditMode } from './composables/useApplicationInformation'

defineProps<{
  isEditMode: boolean
  isSending: boolean
}>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: ApplicationEditMode): void
  (e: 'finishEditing'): void
}>()
const { currentApplication: application, editedValue } = useApplicationStore()

const { me } = useUserStore()
const toast = useToast()

const hasAuthority = computed(() => {
  if (!application.value) return false
  return useApplication(application.value).isApplicationCreator.value(me.value)
})

const editedTargets = ref<ApplicationTargetDetail[]>(
  application.value?.targets.map(t => ({ ...t })) ?? []
)

const selectedUserIds = computed(() => editedTargets.value.map(t => t.target))

const handleDeleteTarget = (id: string) => {
  editedTargets.value = editedTargets.value.filter(target => target.id !== id)
}

const handleUpdateTargets = () => {
  if (editedTargets.value.some(target => target.target === '')) {
    toast.error('払い戻し対象者を選択してください')
    return
  }
  if (!application.value) return

  try {
    editedValue.value.targets = editedTargets.value
    emit('finishEditing')
  } catch {
    toast.error('更新に失敗しました')
  }
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
          :disabled="isSending"
          @click="handleUpdateTargets">
          完了
        </SimpleButton>
        <EditButton
          v-if="hasAuthority"
          :is-edit-mode="isEditMode"
          @click="
            emit(
              'changeEditMode',
              isEditMode ? '' : ('targets' as ApplicationEditMode)
            )
          " />
      </div>
    </div>
    <div v-if="application" class="flex flex-col gap-2">
      <template v-if="isEditMode">
        <ApplicationTarget
          v-for="(target, i) in editedTargets"
          :key="target.id"
          v-model:target-model="editedTargets[i]"
          :is-edit-mode="isEditMode"
          :application="application"
          :target="target"
          :selected-user-ids="selectedUserIds"
          @delete="handleDeleteTarget" />
      </template>
      <template v-else>
        <ApplicationTarget
          v-for="target in application.targets"
          :key="target.id"
          :is-edit-mode="isEditMode"
          :application="application"
          :target="target"
          :selected-user-ids="selectedUserIds" />
      </template>
    </div>
  </div>
</template>
