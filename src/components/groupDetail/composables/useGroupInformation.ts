import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useGroupDetailStore } from '/@/stores/groupDetail'

export type EditMode = 'name' | 'description' | 'budget' | ''

export const useGroupInformation = () => {
  const groupDetailStore = useGroupDetailStore()
  const toast = useToast()

  const { group, editedValue } = storeToRefs(groupDetailStore)

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
      const value = {
        name: editedValue.value.name,
        description: editedValue.value.description,
        budget: editedValue.value.budget
      }
      await groupDetailStore.putGroup(group.value?.id ?? '', value)
      changeEditMode('')
    } catch {
      toast.error('グループ情報の更新に失敗しました')
    }
    isSending.value = false
  }

  return { isSending, editMode, changeEditMode, finishEditing }
}
