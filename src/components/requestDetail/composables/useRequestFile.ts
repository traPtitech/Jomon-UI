import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { File } from '/@/features/file/model'
import {
  deleteFileUsecase,
  useFetchFileWithMetasUsecase
} from '/@/features/file/usecase'

export const useRequestFile = () => {
  const toast = useToast()

  const files = ref<File[]>([])

  const fetchFiles = async (ids: string[]) => {
    try {
      files.value = await useFetchFileWithMetasUsecase(ids)
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
      await deleteFileUsecase(id)
      files.value = files.value.filter(file => file.id !== id)
      toast.success('ファイルを削除しました')
    } catch {
      toast.error('ファイルの削除に失敗しました')
    }
  }

  return { files, fetchFiles, removeFile }
}
