<script lang="ts" setup>
import { ref } from 'vue'

import type { RequestDetail } from '/@/features/request/model'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import InputText from '/@/components/shared/InputText.vue'
import { editRequestUsecase } from '/@/features/request/usecase'
import EditButton from '/@/components/shared/EditButton.vue'
import { useToast } from 'vue-toastification'
import { useUserStore } from '/@/stores/user'
import { useRequest } from '/@/features/request/composables'

const props = defineProps<{
  request: RequestDetail
}>()

const { me } = useUserStore()
const { isRequestCreator } = useRequest(props.request)
const toast = useToast()

const hasAuthority = isRequestCreator.value(me.value)
const isEditMode = ref(false)
const editedTitle = ref(props.request.title)

const toggleEditTitle = () => {
  if (isEditMode.value) {
    editedTitle.value = props.request.title
  }
  isEditMode.value = !isEditMode.value
}
const handleUpdateTitle = async () => {
  try {
    await editRequestUsecase(props.request.id, {
      ...props.request,
      group: props.request.group?.id ?? null,
      title: editedTitle.value
    })
    toast.success('更新しました')
  } catch {
    toast.error('更新に失敗しました')
  }
  isEditMode.value = false
}
</script>

<template>
  <div class="flex gap-2">
    <h1 v-if="!isEditMode" class="text-2xl">{{ request.title }}</h1>
    <InputText v-else v-model="editedTitle" auto-focus class="flex-1" />
    <SimpleButton
      v-if="isEditMode"
      font-size="base"
      padding="sm"
      @click="handleUpdateTitle">
      完了
    </SimpleButton>
    <EditButton
      v-if="hasAuthority"
      :is-edit-mode="isEditMode"
      @click="toggleEditTitle" />
  </div>
</template>
