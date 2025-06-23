import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { usePartitionDetailStore } from '/@/stores/partitionDetail'

import { editPartitionUsecase } from '/@/features/partition/usecase'

export type EditMode = 'name' | 'description' | 'budget' | ''

export const usePartitionInformation = () => {
  const toast = useToast()

  const { partition, editedValue } = usePartitionDetailStore()

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
      await editPartitionUsecase(partition.value?.id ?? '', editedValue.value)
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
