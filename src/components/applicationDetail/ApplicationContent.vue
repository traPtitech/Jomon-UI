<script lang="ts" setup>
import { computed } from 'vue'

import { formatDateAndTime } from '@/lib/date'

import EditButton from '@/components/shared/EditButton.vue'
import MarkdownIt from '@/components/shared/MarkdownIt.vue'
import MarkdownTextarea from '@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import UserIcon from '@/components/shared/UserIcon.vue'
import { useApplication } from '@/features/application/composables'
import { useApplicationStore } from '@/features/application/store'
import { useUserStore } from '@/features/user/store'

import ApplicationAttachment from './ApplicationAttachment.vue'
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
const formattedDateAndTime = computed(() =>
  application.value?.createdAt
    ? formatDateAndTime(application.value.createdAt)
    : ''
)

const { me, userMap } = useUserStore()

const getUserName = (userId: string) => userMap.value[userId] || ''
const getUserNameWithFallback = (userId: string) =>
  userMap.value[userId] || userId

const hasAuthority = computed(() => {
  if (!application.value) return false
  return useApplication(application.value).isApplicationCreator.value(me.value)
})
</script>

<template>
  <div v-if="application !== null" class="flex w-full flex-col gap-3">
    <div class="flex w-full items-center">
      <div class="flex flex-1 items-center gap-4">
        <UserIcon class="w-12" :name="getUserName(application.createdBy)" />
        <div>
          <span class="font-bold">{{
            getUserNameWithFallback(application.createdBy)
          }}</span>
          がこの申請を作成しました
        </div>
      </div>
      <time
        class="text-text-secondary"
        :datetime="application.createdAt.toISO() ?? ''">
        {{ formattedDateAndTime }}
      </time>
    </div>
    <div class="ml-16 flex items-start gap-2">
      <MarkdownTextarea
        v-if="isEditMode"
        v-model="editedValue.content"
        label="詳細"
        class="flex-1" />
      <div
        v-else
        class="w-full flex-1 rounded-lg border border-surface-secondary px-4 py-3">
        <MarkdownIt :text="application.content" />
        <ApplicationAttachment :files="application.files" />
      </div>
      <EditButton
        v-if="hasAuthority"
        :is-edit-mode="isEditMode"
        @click="
          isEditMode
            ? emit('changeEditMode', '')
            : emit('changeEditMode', 'content')
        " />
    </div>
    <div class="flex justify-end">
      <SimpleButton
        v-if="isEditMode"
        font-size="base"
        padding="sm"
        :disabled="isSending"
        @click="emit('finishEditing')">
        完了
      </SimpleButton>
    </div>
  </div>
</template>
