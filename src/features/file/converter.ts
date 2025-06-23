import type { FileMeta as FileMetaData } from '/@/lib/apis'

import type { FileMeta, FileData } from './model'
import { DateTime } from 'luxon'

export const convertFileMetaFromData = (fileMeta: FileMetaData): FileMeta => ({
  id: fileMeta.id,
  name: fileMeta.name,
  mimeType: fileMeta.mime_type,
  createdAt: DateTime.fromISO(fileMeta.created_at)
})

export const convertFileAndMeta = (
  files: File[],
  fileMetas: FileMeta[]
): FileData[] =>
  files.map((file, index) => ({
    id: fileMetas[index].id,
    file: file,
    name: fileMetas[index].name
  }))
