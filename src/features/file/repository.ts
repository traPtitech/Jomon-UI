import apis from '/@/lib/apis'

import { convertFileMetaFromData } from './converter'
import type { FileMeta, FileSeed } from './model'

export const useFileRepository = () => {
  return createFileRepository()
}

const createFileRepository = () => ({
  fetchFile: async (fileId: string): Promise<string> => {
    const { data } = await apis.getFile(fileId)

    return data
  },
  fetchFileMeta: async (fileId: string): Promise<FileMeta> => {
    const { data } = await apis.getFileMeta(fileId)

    return convertFileMetaFromData(data)
  },
  createFile: async (requestId: string, file: FileSeed) => {
    const fileData = {
      name: file.name,
      src: file.src,
      id: requestId
    }
    await apis.postFile(fileData.name, fileData.src, fileData.id)
  },
  deleteFile: async (id: string) => {
    await apis.deleteFile(id)
  }
})
