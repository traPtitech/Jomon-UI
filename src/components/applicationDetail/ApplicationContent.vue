<script lang="ts" setup>
import ApplicationAttachment from './ApplicationAttachment.vue'
import EditButton from '@/components/shared/EditButton.vue'
import MarkdownIt from '@/components/shared/MarkdownIt.vue'
import MarkdownTextarea from '@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import UserIcon from '@/components/shared/UserIcon.vue'
import { useApplication } from '@/features/application/composables'
import type { ApplicationDetail } from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import { useUserStore } from '@/features/user/store'
import { formatDateAndTime } from '@/lib/date'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const props = defineProps<{
  application: ApplicationDetail
}>()

const formattedDateAndTime = formatDateAndTime(props.application.createdAt)

const toast = useToast()
const { isApplicationCreator } = useApplication(props.application)

const { me, userMap } = useUserStore()
const { editApplication } = useApplicationStore()

const hasAuthority = isApplicationCreator.value(me.value)
const isEditMode = ref(false)
const editedContent = ref(props.application.content)
const toggleEditContent = () => {
  if (isEditMode.value) {
    editedContent.value = props.application.content
  }
  isEditMode.value = !isEditMode.value
}
const handleUpdateContent = async () => {
  try {
    await editApplication(props.application.id, {
      ...props.application,
      partition: props.application.partition?.id ?? null, // TODO: 関係ないときでも書かないといけないので、デフォルトの値をどこかに置いておく
      content: editedContent.value
    })
    toast.success('更新しました')
  } catch {
    toast.error('更新に失敗しました')
  }
  isEditMode.value = false
}
</script>

<template>
  <div class="w-full flex flex-col gap-3">
    <div class="flex w-full items-center">
      <div class="flex items-center gap-4 flex-1">
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
        class="border border-surface-secondary px-4 py-3 rounded-lg flex-1 w-full">
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
        @click="handleUpdateContent">
        完了
      </SimpleButton>
    </div>
  </div>
</template>
