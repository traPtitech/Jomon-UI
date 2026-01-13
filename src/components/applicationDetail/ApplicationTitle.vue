<script lang="ts" setup>
import { computed } from 'vue'

import BaseTextInput from '@/components/shared/BaseInput/BaseTextInput.vue'
import EditButton from '@/components/shared/EditButton.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { useApplication } from '@/features/application/composables'
import { useApplicationStore } from '@/features/application/store'
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

const hasAuthority = computed(() => {
  if (!application.value) return false
  return useApplication(application.value).isApplicationCreator.value(me.value)
})
</script>

<template>
  <div class="flex gap-2">
    <h1 v-if="!isEditMode" class="text-2xl">
      {{ application?.title }}
    </h1>
    <BaseTextInput
      v-else
      v-model="editedValue.title"
      label="タイトル"
      class="flex-1" />
    <SimpleButton
      v-if="isEditMode"
      font-size="base"
      padding="sm"
      :disabled="isSending"
      @click="emit('finishEditing')">
      完了
    </SimpleButton>
    <EditButton
      v-if="hasAuthority"
      :is-edit-mode="isEditMode"
      @click="
        emit(
          'changeEditMode',
          isEditMode ? '' : ('title' as ApplicationEditMode)
        )
      " />
  </div>
</template>
