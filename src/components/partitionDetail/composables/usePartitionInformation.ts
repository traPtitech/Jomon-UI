import { ref } from 'vue'

import { useToast } from 'vue-toastification'

import { usePartitionStore } from '@/features/partition/store'

export type PartitionEditMode = 'name' | 'partitionGroup' | 'budget' | ''

export const usePartitionInformation = () => {
  const toast = useToast()

  const { currentPartition, editedValue, editPartition } = usePartitionStore()

  const isSending = ref(false)

  const editMode = ref<PartitionEditMode>('')
  const changeEditMode = (mode: PartitionEditMode) => {
    if (mode !== '') {
      editMode.value = mode
    } else {
      editMode.value = ''
    }
  }

  const finishEditing = async () => {
    if (!currentPartition.value) return

    isSending.value = true
    try {
      await editPartition(currentPartition.value.id, editedValue.value)
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
