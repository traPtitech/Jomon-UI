import { ref } from 'vue'

import { useToast } from 'vue-toastification'

import { useApplicationStore } from '@/features/application/store'

export type ApplicationEditMode = 'content' | ''

export const useApplicationInformation = () => {
  const toast = useToast()
  const { currentApplication, editedValue, editApplication } =
    useApplicationStore()

  const editMode = ref<ApplicationEditMode>('')

  const changeEditMode = (mode: ApplicationEditMode) => {
    if (mode !== '') {
      editMode.value = mode
    } else {
      editMode.value = ''
      if (currentApplication.value) {
        editedValue.value = currentApplication.value
      }
    }
  }

  const finishEditing = async () => {
    if (!currentApplication.value) return

    try {
      await editApplication(currentApplication.value.id, editedValue.value)
      toast.success('申請情報を更新しました')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
    changeEditMode('')
  }

  return { editMode, changeEditMode, finishEditing }
}
