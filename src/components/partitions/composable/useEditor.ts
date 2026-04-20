import { type Ref, ref } from 'vue'

import { useToast } from 'vue-toastification'

export const useEditor = <T extends string | number | null>(
  currentValue: Ref<T>,
  editedValue: Ref<T>,
  saveEdit: () => Promise<void>,
  errorMessage: string
) => {
  const toast = useToast()

  const isEditMode = ref(false)
  const isSaving = ref(false)

  const handleSave = async () => {
    if (editedValue.value === currentValue.value) {
      isEditMode.value = false
      return
    }
    isSaving.value = true
    try {
      await saveEdit()
      isEditMode.value = false
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      } else {
        toast.error(errorMessage)
      }
    } finally {
      isSaving.value = false
    }
  }

  return {
    isEditMode,
    isSaving,
    handleSave,
  }
}
