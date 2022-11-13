import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useGroupDetailStore } from '/@/stores/groupDetail'

export type EditMode = 'name' | 'description' | 'budget' | ''

export const useGroupInformation = () => {
  const groupDetailStore = useGroupDetailStore()

  const { group, editedValue } = storeToRefs(groupDetailStore)

  const isSending = ref(false)

  const editMode = ref<EditMode>('')

  const changeEditMode = async (kind: EditMode) => {
    if (kind !== '') {
      editMode.value = kind
    } else {
      isSending.value = true
      const value = {
        name: editedValue.value.name,
        description: editedValue.value.description,
        budget: Number(editedValue.value.budget)
      }
      await groupDetailStore.putGroup(group.value?.id ?? '', value)
      editMode.value = ''
      isSending.value = false
    }
  }
  return { isSending, editMode, changeEditMode }
}
