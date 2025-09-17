<script lang="ts" setup>
import BaseInput from '@/components/shared/BaseInput.vue'
import EditButton from '@/components/shared/EditButton.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { useApplication } from '@/features/application/composables'
import type { ApplicationDetail } from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import { useUserStore } from '@/features/user/store'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const props = defineProps<{
  application: ApplicationDetail
}>()

const { me } = useUserStore()
const { isApplicationCreator } = useApplication(props.application)
const { editApplication } = useApplicationStore()
const toast = useToast()

const hasAuthority = isApplicationCreator.value(me.value)
const isEditMode = ref(false)
const editedTitle = ref(props.application.title)

const toggleEditTitle = () => {
  if (isEditMode.value) {
    editedTitle.value = props.application.title
  }
  isEditMode.value = !isEditMode.value
}
const handleUpdateTitle = async () => {
  try {
    await editApplication(props.application.id, {
      ...props.application,
      partition: props.application.partition?.id ?? null,
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
    <h1 v-if="!isEditMode" class="text-2xl">{{ application.title }}</h1>
    <BaseInput v-else v-model="editedTitle" label="タイトル" class="flex-1" />
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
