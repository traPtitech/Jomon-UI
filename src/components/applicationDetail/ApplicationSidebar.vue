<script lang="ts" setup>
import ApplicationPartition from '@/components/applicationDetail/ApplicationPartition.vue'
import ApplicationTags from '@/components/applicationDetail/ApplicationTags.vue'
import ApplicationTargets from '@/components/applicationDetail/ApplicationTargets.vue'
import { useApplicationInformation } from '@/components/applicationDetail/composables/useApplicationInformation'
import type { ApplicationDetail } from '@/features/application/entities'

const application = defineModel<ApplicationDetail>({ required: true })

const { editMode, isSending, changeEditMode, finishEditing } =
  useApplicationInformation()
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-3">
      <ApplicationPartition v-model="application" />
      <ApplicationTags
        :is-edit-mode="editMode === 'tags'"
        :is-sending="isSending"
        @change-edit-mode="changeEditMode"
        @finish-editing="finishEditing" />
    </div>
    <ApplicationTargets
      :is-edit-mode="editMode === 'targets'"
      :is-sending="isSending"
      @change-edit-mode="changeEditMode"
      @finish-editing="finishEditing" />
  </div>
</template>
