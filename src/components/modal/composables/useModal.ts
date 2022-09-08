import { ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

export const useModal = () => {
  const shouldShowModal = ref(false)
  const openModal = () => {
    shouldShowModal.value = true
  }
  const closeModal = () => {
    shouldShowModal.value = false
  }
  onBeforeRouteUpdate(() => {
    console.log('aaa')
  })
  return { shouldShowModal, openModal, closeModal }
}
