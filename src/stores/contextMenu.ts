import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ContextMenuState = 'statusChange' | 'requestDetail' | ''

//todo:ページ遷移時にリセットするように
export const useContextMenuStore = defineStore('contextMenu', () => {
  const contextMenuState = ref<ContextMenuState>('')
  const handleOpenContextMenu = (state: ContextMenuState) => {
    contextMenuState.value = state
  }
  const handleCloseContextMenu = () => {
    if (contextMenuState.value !== '') {
      contextMenuState.value = ''
    }
  }
  return {
    contextMenuState,
    handleOpenContextMenu,
    handleCloseContextMenu
  }
})
