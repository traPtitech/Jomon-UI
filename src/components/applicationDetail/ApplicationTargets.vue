<script lang="ts" setup>
import { useUserStore } from '/@/stores/user'

import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import ApplicationTarget from '/@/components/applicationDetail/ApplicationTarget.vue'
import EditButton from '/@/components/shared/EditButton.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useApplication } from '/@/features/application/composables'
import type { ApplicationDetail } from '/@/features/application/model'
import { editApplicationUsecase } from '/@/features/application/usecase'
import type { ApplicationTargetDetail } from '/@/features/applicationTarget/model'

const props = defineProps<{
  application: ApplicationDetail
}>()

const { me } = useUserStore()
const { isApplicationCreator } = useApplication(props.application)
const toast = useToast()

const hasAuthority = isApplicationCreator.value(me.value)

const isEditMode = ref(false)
const editedTargets = ref<ApplicationTargetDetail[]>(props.application.targets)
const toggleEditTargets = () => {
  editedTargets.value = props.application.targets
  isEditMode.value = !isEditMode.value
}

const handleUpdateTargets = async () => {
  if (editedTargets.value.some(target => target.target === null)) {
    toast.error('払い戻し対象者を選択してください')
    return
  }
  try {
    await editApplicationUsecase(props.application.id, {
      ...props.application,
      partition: props.application.partition?.id ?? null, // TODO: 関係ないときでも書かないといけないので、デフォルトの値をどこかに置いておく
      targets: editedTargets.value
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
      <ApplicationTarget
        v-for="(target, i) in application.targets"
        :key="target.id"
        v-model:target-model="editedTargets[i]"
        :is-edit-mode="isEditMode"
        :application="application"
        :target="target" />
    </div>
  </div>
</template>
