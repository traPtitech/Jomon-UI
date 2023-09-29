import type { FileMeta as FileMetaData } from '/@/lib/apis'

import type { FileMeta, File } from './model'

export const convertFileMetaFromData = (fileMeta: FileMetaData): FileMeta => ({
  id: fileMeta.id,
  name: fileMeta.name,
  mimeType: fileMeta.mime_type
})

export const convertFileAndMeta = (
  files: string[],
  fileMetas: FileMeta[]
): File[] =>
  files.map((file, index) => ({
    id: fileMetas[index].id,
    file: file,
    name: fileMetas[index].name
  }))
