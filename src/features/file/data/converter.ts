import { DateTime } from 'luxon'
import type { FileData, FileMeta } from '../entities'
import type { FileMeta as FileMetaData } from '@/lib/apis'

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
