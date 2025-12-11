import { ref, watch } from 'vue'

import { useToast } from 'vue-toastification'

import type { PartitionSeedDraft } from '@/features/partition/entities'
import { usePartitionStore } from '@/features/partition/store'

export type EditMode = 'name' | 'partitionGroup' | 'budget' | ''

export const usePartitionInformation = () => {
  const toast = useToast()

  const { currentPartition, editPartition } = usePartitionStore()

  // Local Draft State
  // Initialize with default or current values.
  const editedValue = ref<PartitionSeedDraft>({
    name: '',
    budget: 0,
    parentPartitionGroupId: null,
    management: { category: 'manual', state: 'available' },
  })

  // Sync Draft when Current Partition changes (e.g. data loaded)
  watch(
    currentPartition,
    newVal => {
      if (newVal) {
        editedValue.value = {
          name: newVal.name,
          budget: newVal.budget,
          parentPartitionGroupId: newVal.parentPartitionGroupId,
          management: { ...newVal.management },
        }
      }
    },
    { immediate: true }
  )

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

  return {
    isSending,
    editMode,
    changeEditMode,
    finishEditing,
    editedValue,
  }
}
