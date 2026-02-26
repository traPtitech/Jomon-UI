<script lang="ts" setup>
import ApplicationPartition from '@/components/applicationDetail/ApplicationPartition.vue'
import ApplicationTags from '@/components/applicationDetail/ApplicationTags.vue'
import ApplicationTargets from '@/components/applicationDetail/ApplicationTargets.vue'
import type { ApplicationEditMode } from '@/components/applicationDetail/composables/useApplicationInformation.ts'
import type { ApplicationDetail } from '@/features/application/entities'

const props = defineProps<{
  application: ApplicationDetail
  isSending: boolean
  editMode: ApplicationEditMode
  changeEditMode: (mode: ApplicationEditMode) => void
  finishEditing: () => void
}>()
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-3">
      <ApplicationPartition
        :application="props.application"
        :is-edit-mode="props.editMode === 'partition'"
        :is-sending="props.isSending"
        @change-edit-mode="props.changeEditMode"
        @finish-editing="props.finishEditing" />
      <ApplicationTags
        :application="props.application"
        :is-edit-mode="props.editMode === 'tags'"
        :is-sending="props.isSending"
        @change-edit-mode="props.changeEditMode"
        @finish-editing="props.finishEditing" />
    </div>
    <ApplicationTargets
      :application="props.application"
      :is-edit-mode="props.editMode === 'targets'"
      :is-sending="props.isSending"
      @change-edit-mode="props.changeEditMode"
      @finish-editing="props.finishEditing" />
  </div>
</template>
