import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGeneralStore = defineStore('general', () => {
  const isModalOpen = ref<boolean>(false)
  const isModalOpen2 = ref<boolean>(false)
  return { isModalOpen, isModalOpen2 }
})
