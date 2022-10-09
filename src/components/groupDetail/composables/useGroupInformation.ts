import { ref } from 'vue'

import { useToastStore } from '/@/stores/toast'

import type { GroupDetail, PostGroup } from '/@/lib/apis'
import apis from '/@/lib/apis'

export type EditMode = 'name' | 'description' | 'budget' | ''

export const useGroupInformation = (group: GroupDetail) => {
  const toastStore = useToastStore()

  const isSending = ref(false)

  const editMode = ref<EditMode>('')
  const editedValue = ref({
    name: group.name,
    description: group.description,
    budget: group.budget.toString()
  })

  const changeEditMode = async (
    kind: EditMode,
    emit: (e: 'fixGroup', value: GroupDetail) => void
  ) => {
    if (kind !== '') {
      editMode.value = kind
    } else {
      const value = {
        name: editedValue.value.name,
        description: editedValue.value.description,
        budget: Number(editedValue.value.budget)
      }
      await putGroup(group.id, value, emit)
      editMode.value = ''
    }
  }
  const putGroup = async (
    id: string,
    willPutGroup: PostGroup,
    emit: (e: 'fixGroup', value: GroupDetail) => void
  ) => {
    isSending.value = true //挙動怪しい

    try {
      const res = (await apis.putGroupDetail(id, willPutGroup)).data
      const nextGroup: GroupDetail = {
        ...group,
        name: res.name,
        description: res.description,
        budget: res.budget
      }
      emit('fixGroup', nextGroup)
      editedValue.value = {
        name: nextGroup.name,
        description: nextGroup.description,
        budget: nextGroup.budget.toString()
      }
    } catch {
      toastStore.showToast({
        type: 'error',
        message: 'グループの更新に失敗しました'
      })
      editedValue.value = {
        name: group.name,
        description: group.description,
        budget: group.budget.toString()
      }
    } finally {
      isSending.value = false
    }
  }
  return { isSending, editMode, editedValue, changeEditMode }
}
