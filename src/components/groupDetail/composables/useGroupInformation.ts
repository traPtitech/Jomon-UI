import { ref } from 'vue'

import { useGroupDetailStore } from '/@/stores/groupDetail'

export type EditMode = 'name' | 'description' | 'budget' | ''

export const useGroupInformation = () => {
  const groupDetailStore = useGroupDetailStore()

  const isSending = ref(false)

  const editMode = ref<EditMode>('')

  const changeEditMode = async (kind: EditMode) => {
    if (kind !== '') {
      editMode.value = kind
    } else {
      isSending.value = true
      const value = {
        name: groupDetailStore.editedValue.name,
        description: groupDetailStore.editedValue.description,
        budget: Number(groupDetailStore.editedValue.budget)
      }
      await groupDetailStore.putGroup(groupDetailStore.group?.id ?? '', value)
      editMode.value = ''
      isSending.value = false
    }
  }
  return { isSending, editMode, changeEditMode }
}
