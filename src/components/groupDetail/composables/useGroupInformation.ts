import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useGroupDetailStore } from '/@/stores/groupDetail'

import { editGroupUsecase } from '/@/features/group/usecase'

export type EditMode = 'name' | 'description' | 'budget' | ''

export const useGroupInformation = () => {
  const toast = useToast()

  const { group, editedValue } = useGroupDetailStore()

  const isSending = ref(false)

  const editMode = ref<EditMode>('')
  const changeEditMode = (mode: EditMode) => {
    if (mode !== '') {
      editMode.value = mode
    } else {
      editMode.value = ''
    }
  }

  const finishEditing = async () => {
    isSending.value = true
    try {
      await editGroupUsecase(group.value?.id ?? '', editedValue.value)
      toast.success('パーティション情報を更新しました')
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
