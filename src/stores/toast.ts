import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error'

export interface Toast {
  type: ToastType
  message: string
}

export const useToastStore = defineStore('toast', () => {
  const shouldShowToast = ref(false)
  const toastType = ref<ToastType>('success')
  const toastMessage = ref<string>('')

  const showToast = (toastArg: Toast) => {
    toastType.value = toastArg.type
    toastMessage.value = toastArg.message
    shouldShowToast.value = true
  }

  const removeToast = () => {
    shouldShowToast.value = false
  }

  return {
    shouldShowToast,
    toastType,
    toastMessage,
    showToast,
    removeToast
  }
})
