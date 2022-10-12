import { ref } from 'vue'

export const useModal = () => {
  const shouldShowModal = ref(false)
  const openModal = () => {
    shouldShowModal.value = true
  }
  const closeModal = () => {
    shouldShowModal.value = false
  }
  return { shouldShowModal, openModal, closeModal }
}
