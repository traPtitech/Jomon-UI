import { convertFileAndMeta } from './data/converter'
import { useFileRepository } from './data/repository'
import type { FileData, FileSeed } from './entities'

export const fetchFiles = async (fileIds: string[]): Promise<File[]> => {
  const repository = useFileRepository()

  try {
    const promises = fileIds.map(async fileId => {
      const text = await repository.fetchFile(fileId)
      return new File([text], fileId)
    })
    return await Promise.all(promises)
  } catch {
    throw new Error('ファイルの取得に失敗しました')
  }
}

export const fetchFileMetas = async (fileIds: string[]) => {
  const repository = useFileRepository()

  try {
    const promises = fileIds.map(fileId => repository.fetchFileMeta(fileId))
    return await Promise.all(promises)
  } catch {
    throw new Error('ファイルの取得に失敗しました')
  }
}

export const fetchFilesWithMetas = async (
  fileIds: string[]
): Promise<FileData[]> => {
  try {
    const files = await fetchFiles(fileIds)
    const fileMetas = await fetchFileMetas(fileIds)

    return convertFileAndMeta(files, fileMetas)
  } catch {
    throw new Error('ファイルの取得に失敗しました')
  }
}

export const createFiles = async (
  applicationId: string,
  fileSeeds: FileSeed[]
) => {
  const repository = useFileRepository()

  try {
    const promises = fileSeeds.map(fileSeed =>
      repository.createFile(applicationId, fileSeed)
    )
    return await Promise.all(promises)
  } catch {
    throw new Error('ファイルの送信に失敗しました')
  }
}

export const deleteFile = async (fileId: string) => {
  const repository = useFileRepository()

  try {
    await repository.deleteFile(fileId)
  } catch {
    throw new Error('ファイルの削除に失敗しました')
  }
}
