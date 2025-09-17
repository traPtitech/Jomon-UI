import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { FileData } from '/@/features/file/entities'
import { deleteFile, fetchFilesWithMetas } from '/@/features/file/services'

export const useApplicationFile = () => {
  const toast = useToast()

  const files = ref<FileData[]>([])

  const fetchFiles = async (ids: string[]) => {
    try {
      files.value = await fetchFilesWithMetas(ids)
    } catch {
      toast.error('ファイルの取得に失敗しました')
    }
  }

  const removeFile = async (id: string) => {
    const result = confirm('この画像を削除しますか？')
    if (!result) {
      return
    }
    try {
      await deleteFile(id)
      files.value = files.value.filter(file => file.id !== id)
      toast.success('ファイルを削除しました')
    } catch {
      toast.error('ファイルの削除に失敗しました')
    }
  }

  return { files, fetchFiles, removeFile }
}
