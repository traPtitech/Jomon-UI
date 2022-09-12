import { ref } from 'vue'

export type ToastType = 'success' | 'error'

export interface Toast {
  type: ToastType
  message: string
}

export const useToast = () => {
  const shouldShowToast = ref(false)
  const toastType = ref<ToastType>('success')
  const toastMessage = ref<string>('')

  const showToast = (emitArg: Toast) => {
    toastType.value = emitArg.type
    toastMessage.value = emitArg.message
    shouldShowToast.value = true
  }

  return { shouldShowToast, toastType, toastMessage, showToast }
}
