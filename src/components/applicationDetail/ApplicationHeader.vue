<script lang="ts" setup>
import { computed } from 'vue'

import ApplicationStatusChange from '@/components/applicationDetail/ApplicationStatusChange.vue'
import ApplicationTitle from '@/components/applicationDetail/ApplicationTitle.vue'
import type { ApplicationEditMode } from '@/components/applicationDetail/composables/useApplicationInformation.ts'
import type { ApplicationDetail } from '@/features/application/entities'

const props = defineProps<{
  application: ApplicationDetail
  isSending: boolean
  editMode: ApplicationEditMode
  changeEditMode: (mode: ApplicationEditMode) => void
  finishEditing: () => void
}>()

const totalAmount = computed(() =>
  props.application.targets.reduce((a, target) => a + target.amount, 0)
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <ApplicationTitle
      :is-edit-mode="props.editMode === 'title'"
      :is-sending="props.isSending"
      @change-edit-mode="props.changeEditMode"
      @finish-editing="props.finishEditing" />
    <div class="flex items-center justify-between">
      <ApplicationStatusChange :application="props.application" />
      <div class="text-3xl font-bold">{{ totalAmount }}円</div>
    </div>
  </div>
</template>
