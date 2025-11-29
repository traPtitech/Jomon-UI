<script lang="ts" setup>
import ApplicationAttachment from './ApplicationAttachment.vue'
import { usePartitionInformation } from './composables/useApplicationInformation'
import EditButton from '@/components/shared/EditButton.vue'
import MarkdownIt from '@/components/shared/MarkdownIt.vue'
import MarkdownTextarea from '@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import UserIcon from '@/components/shared/UserIcon.vue'
import { useApplication } from '@/features/application/composables'
import type { ApplicationDetail } from '@/features/application/entities'
import { useUserStore } from '@/features/user/store'
import { formatDateAndTime } from '@/lib/date'
import { ref } from 'vue'

const props = defineProps<{
  application: ApplicationDetail
}>()

const formattedDateAndTime = formatDateAndTime(props.application.createdAt)

const { isApplicationCreator } = useApplication(props.application)

const { me, userMap } = useUserStore()

const hasAuthority = isApplicationCreator.value(me.value)
const editedContent = ref(props.application.content)
const { isEditMode, toggleEditContent, handleUpdateContent } =
  usePartitionInformation(props.application, editedContent)

const onUpdateClick = async () => {
  await handleUpdateContent()
}
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <div class="flex w-full items-center">
      <div class="flex flex-1 items-center gap-4">
        <UserIcon class="w-12" :name="userMap[application.createdBy]" />
        <div>
          <span class="font-bold">{{ userMap[application.createdBy] }}</span>
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
      <div
        v-if="!isEditMode"
        class="w-full flex-1 rounded-lg border border-surface-secondary px-4 py-3">
        <MarkdownIt :text="application.content" />
        <ApplicationAttachment :files="application.files" />
      </div>
      <MarkdownTextarea
        v-else
        v-model="editedContent"
        label="詳細"
        class="flex-1" />
      <EditButton
        v-if="hasAuthority"
        :is-edit-mode="isEditMode"
        @click="toggleEditContent" />
    </div>
    <div class="flex justify-end">
      <SimpleButton
        v-if="isEditMode"
        font-size="base"
        padding="sm"
        @click="onUpdateClick">
        完了
      </SimpleButton>
    </div>
  </div>
</template>
