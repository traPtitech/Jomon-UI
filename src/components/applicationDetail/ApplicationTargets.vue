<script lang="ts" setup>
import { computed, ref } from 'vue'

import { useToast } from 'vue-toastification'

import ApplicationTarget from '@/components/applicationDetail/ApplicationTarget.vue'
import EditButton from '@/components/shared/EditButton.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import UserIcon from '@/components/shared/UserIcon.vue'
import { useApplication } from '@/features/application/composables'
import type { ApplicationDetail } from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import { useUserStore } from '@/features/user/store'

const props = defineProps<{
  application: ApplicationDetail
}>()

const { getUserName, getUserNameWithFallback, me } = useUserStore()
const { isApplicationCreator } = useApplication(props.application)
const { editApplication } = useApplicationStore()
const toast = useToast()

const hasAuthority = isApplicationCreator.value(me.value)

const isEditMode = ref(false)
const editedTargets = ref(props.application.targets.map(t => ({ ...t })))

const selectedUserIds = computed(() =>
  isEditMode.value
    ? editedTargets.value.map(t => t.target)
    : props.application.targets.map(t => t.target)
)

const handleDeleteTarget = (id: string) => {
  editedTargets.value = editedTargets.value.filter(target => target.id !== id)
}

const toggleEditTargets = () => {
  editedTargets.value = props.application.targets.map(t => ({ ...t }))
  isEditMode.value = !isEditMode.value
}

const handleUpdateTargets = async () => {
  if (editedTargets.value.some(target => target.target === '')) {
    toast.error('払い戻し対象者を選択してください')
    return
  }
  try {
    await editApplication(props.application.id, {
      ...props.application,
      partition: props.application.partition.id,
      targets: editedTargets.value,
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
        <template v-for="(target, i) in editedTargets" :key="target.id">
          <ApplicationTarget
            v-if="editedTargets[i]"
            v-model:target-model="editedTargets[i]"
            :is-edit-mode="isEditMode"
            :application="application"
            :target="target"
            :selected-user-ids="selectedUserIds"
            @delete="handleDeleteTarget" />
          <div v-else class="text-error-primary">
            [エラー] 対象者データの読み込みに失敗しました
          </div>
        </template>
      </template>
      <template v-else>
        <template v-for="target in application.targets" :key="target.id">
          <div
            class="flex flex-wrap items-center justify-between gap-2 md:gap-0">
            <div class="flex items-center gap-1">
              <UserIcon class="w-10" :name="getUserName(target.target)" />
              <div class="flex flex-col gap-1 break-all">
                <div>{{ getUserNameWithFallback(target.target) }}</div>
                <div>{{ target.amount }}円</div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
