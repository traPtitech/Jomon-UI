import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useGroupDetailStore } from '/@/stores/groupDetail'

export type EditMode = 'name' | 'description' | 'budget' | ''

export const useGroupInformation = () => {
  const groupDetailStore = useGroupDetailStore()

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

  const settle = async () => {
    isSending.value = true
    const value = {
      name: editedValue.value.name,
      description: editedValue.value.description,
      budget: editedValue.value.budget
    }
    await groupDetailStore.putGroup(group.value?.id ?? '', value)
    isSending.value = false
    changeEditMode('')
  }

  return { isSending, editMode, changeEditMode, settle }
}
