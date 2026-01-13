import { ref } from 'vue'

import { useToast } from 'vue-toastification'

import { useApplicationStore } from '@/features/application/store'

export type ApplicationEditMode = 'content' | 'targets' | ''

export const useApplicationInformation = () => {
  const toast = useToast()
  const { currentApplication, editedValue, editApplication } =
    useApplicationStore()

  const isSending = ref(false)

  const editMode = ref<ApplicationEditMode>('')

  const changeEditMode = (mode: ApplicationEditMode) => {
    if (mode !== '') {
      editMode.value = mode
      if (currentApplication.value) {
        editedValue.value = {
          createdBy: currentApplication.value.createdBy,
          title: currentApplication.value.title,
          content: currentApplication.value.content,
          tags: [...currentApplication.value.tags],
          partition: currentApplication.value.partition.id,
          targets: [...currentApplication.value.targets],
        }
      }
    } else {
      editMode.value = ''
      if (currentApplication.value) {
        editedValue.value = {
          createdBy: currentApplication.value.createdBy,
          title: currentApplication.value.title,
          content: currentApplication.value.content,
          tags: [...currentApplication.value.tags],
          partition: currentApplication.value.partition.id,
          targets: [...currentApplication.value.targets],
        }
      }
    }
  }

  const finishEditing = async () => {
    if (!currentApplication.value) return

    isSending.value = true
    try {
      await editApplication(currentApplication.value.id, editedValue.value)
      toast.success('申請情報を更新しました')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
    changeEditMode('')
    isSending.value = false
  }

  return { isSending, editMode, changeEditMode, finishEditing }
}
