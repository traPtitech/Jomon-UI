import apis from '/@/lib/apis'

import { convertFileMetaFromData } from './converter'
import type { FileMeta, FileSeed } from './model'

export const useFileRepository = () => {
  return createFileRepository()
}

const createFileRepository = () => ({
  fetchFile: async (fileId: string): Promise<string> => {
    const { data } = await apis.getFile(fileId)

    return await data.text()
  },
  fetchFileMeta: async (fileId: string): Promise<FileMeta> => {
    const { data } = await apis.getFileMeta(fileId)

    return convertFileMetaFromData(data)
  },
  createFile: async (applicationId: string, file: FileSeed) => {
    const { data } = await apis.postFile(file.file, file.name, applicationId)

    return data.id
  },
  deleteFile: async (id: string) => {
    await apis.deleteFile(id)
  }
})
