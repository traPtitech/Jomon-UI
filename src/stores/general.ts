import { defineStore } from 'pinia'

export const useGeneralStore = defineStore('general', {
  state: () => ({ isModalOpen: false, isModalOpen2: false })
})
