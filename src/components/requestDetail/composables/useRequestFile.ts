import type { AxiosResponse } from 'axios'
import { ref } from 'vue'

import apis, { type FileMeta } from '/@/lib/apis'

export interface File {
  id: string
  file: string
  name: string
}

export const useRequestFile = () => {
  const files = ref<File[]>([])

  const fetchFiles = async (ids: string[]) => {
    const filePromises: Promise<AxiosResponse<string>>[] = []
    const fileMetaPromises: Promise<AxiosResponse<FileMeta>>[] = []
    ids.forEach(async id => {
      filePromises.push(apis.getFile(id))
      fileMetaPromises.push(apis.getFileMeta(id))
    })
    const fileList = await Promise.all(filePromises)
    const fileMetaList = await Promise.all(fileMetaPromises)
    files.value = fileList.map((file, index) => ({
      id: fileMetaList[index].data.id,
      file: file.data,
      name: fileMetaList[index].data.name
    }))
  }
  return { files, fetchFiles }
}
