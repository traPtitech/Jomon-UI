import { convertFileAndMeta } from './converter'
import type { FileSeed, FileData } from './model'
import { useFileRepository } from './repository'

export const useFetchFilesUsecase = async (fileIds: string[]) => {
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

export const useFetchFileMetasUsecase = async (fileIds: string[]) => {
  const repository = useFileRepository()

  try {
    const promises = fileIds.map(fileId => repository.fetchFileMeta(fileId))
    return await Promise.all(promises)
  } catch {
    throw new Error('ファイルの取得に失敗しました')
  }
}

export const useFetchFileWithMetasUsecase = async (
  fileIds: string[]
): Promise<FileData[]> => {
  try {
    const filePromises = await useFetchFilesUsecase(fileIds)
    const fileMetaPromises = await useFetchFileMetasUsecase(fileIds)

    return convertFileAndMeta(filePromises, fileMetaPromises)
  } catch {
    throw new Error('ファイルの取得に失敗しました')
  }
}

export const createFilesUsecase = async (
  requestId: string,
  fileSeeds: FileSeed[]
) => {
  const repository = useFileRepository()

  try {
    const promises = fileSeeds.map(fileSeed =>
      repository.createFile(requestId, fileSeed)
    )
    return await Promise.all(promises)
  } catch {
    throw new Error('ファイルの送信に失敗しました')
  }
}

export const deleteFileUsecase = async (requestId: string) => {
  const repository = useFileRepository()

  try {
    await repository.deleteFile(requestId)
  } catch {
    throw new Error('パーティションの削除に失敗しました')
  }
}
