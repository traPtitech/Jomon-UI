<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useUserStore } from '/@/stores/user'

import { formatDateAndTime } from '/@/lib/date'

import MarkdownIt from '/@/components//shared/MarkdownIt.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'
import type { RequestDetail } from '/@/features/request/model'
import { ref } from 'vue'
import { editRequestUsecase } from '/@/features/request/usecase'
import EditButton from '/@/components/shared/EditButton.vue'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useToast } from 'vue-toastification'
import { useRequest } from '/@/features/request/composables'

const props = defineProps<{
  request: RequestDetail
}>()

const formattedDateAndTime = formatDateAndTime(props.request.createdAt)

const userStore = useUserStore()
const { userMap } = storeToRefs(userStore)
const toast = useToast()
const { isRequestCreator } = useRequest(props.request)
const { me } = storeToRefs(userStore)

const hasAuthority = isRequestCreator.value(me.value)
const isEditMode = ref(false)
const editedContent = ref(props.request.content)
const toggleEditContent = () => {
  if (isEditMode.value) {
    editedContent.value = props.request.content
  }
  isEditMode.value = !isEditMode.value
}
const handleUpdateContent = async () => {
  try {
    await editRequestUsecase(props.request.id, {
      ...props.request,
      group: props.request.group?.id ?? null, // TODO: 関係ないときでも書かないといけないので、デフォルトの値をどこかに置いておく
      content: editedContent.value
    })
    toast.success('更新しました')
  } catch {
    toast.error('更新に失敗しました')
  }
  isEditMode.value = false
}

const files = [
  {
    name: 'oisu-.png',
    url: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1280&q=80',
    alt: 'tailwind sample'
  },
  {
    name: 'oisu-.png',
    url: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1280&q=80',
    alt: 'tailwind sample'
  },
  {
    name: 'oisu-.png',
    url: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1280&q=80',
    alt: 'tailwind sample'
  },
  {
    name: 'oisu-.png',
    url: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1280&q=80',
    alt: 'tailwind sample'
  },
  {
    name: 'oisu-.png',
    url: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1280&q=80',
    alt: 'tailwind sample'
  }
]
const handleFileUpload = async () => {
  try {
    toast.success('ファイルを追加しました')
  } catch {
    toast.error('ファイルの追加に失敗しました')
  }
}
</script>

<template>
  <div class="w-full flex flex-col gap-3">
    <div class="flex w-full items-center">
      <div class="flex items-center gap-4 flex-1">
        <UserIcon class="w-12" :name="userMap[request.createdBy]" />
        <div>
          <span class="font-bold">{{ userMap[request.createdBy] }}</span>
          がこの申請を作成しました
        </div>
      </div>
      <time
        class="text-text-secondary"
        :datetime="request.createdAt.toISO() ?? ''">
        {{ formattedDateAndTime }}
      </time>
    </div>
    <div class="ml-16 flex items-start gap-2">
      <div
        v-if="!isEditMode"
        class="border border-surface-secondary px-4 py-3 rounded-lg flex-1 w-full">
        <MarkdownIt :text="request.content" />
        <div class="m-3 overflow-auto">
          <div class="flex gap-3">
            <div v-for="file in files" :key="file.name">
              <div
                class="bg-surface-secondary w-32 overflow-hidden rounded"
                :model-value="file.name">
                <img
                  :alt="file.alt"
                  class="object-cover h-36 w-full"
                  :src="file.url" />
              </div>
              <p class="mt-2 text-center">{{ file.name }}</p>
            </div>
          </div>
          <div class="flex gap-3 mt-3">
            <div v-for="file in files" :key="file.name">
              <div
                class="bg-surface-secondary w-96 overflow-hidden rounded"
                :model-value="file.name">
                <img
                  :alt="file.alt"
                  class="object-cover h-60 w-full"
                  :src="file.url" />
              </div>
              <p class="mt-2">{{ file.name }}</p>
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <label
            class="flex items-center rounded-md border py-2 px-4 hover:bg-hover-primary border-surface-secondary cursor-pointer"
            for="file_upload">
            添付ファイルを追加
            <input
              id="file_upload"
              class="hidden"
              type="file"
              @change="handleFileUpload" />
          </label>
        </div>
      </div>
      <MarkdownTextarea
        v-else
        v-model="editedContent"
        auto-focus
        class="flex-1" />
      <EditButton
        v-if="hasAuthority"
        :is-edit-mode="isEditMode"
        @click="toggleEditContent" />
    </div>
    <div class="flex justify-end">
      <SimpleButton v-if="isEditMode" padding="sm" @click="handleUpdateContent">
        完了
      </SimpleButton>
    </div>
  </div>
</template>
