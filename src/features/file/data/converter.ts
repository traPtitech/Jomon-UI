import { DateTime } from 'luxon'

import type { FileMeta as FileMetaData } from '@/lib/apis'

import type { FileData, FileMeta } from '../entities'

export const convertFileMetaFromData = (fileMeta: FileMetaData): FileMeta => ({
  id: fileMeta.id,
  name: fileMeta.name,
  mimeType: fileMeta.mime_type,
  createdAt: DateTime.fromISO(fileMeta.created_at),
})

export const convertFileAndMeta = (
  files: File[],
  fileMetas: FileMeta[]
): FileData[] =>
  files.map((file, index) => {
    const meta = fileMetas[index]
    if (!meta) {
      throw new Error(`FileMeta not found at index ${String(index)}`)
    }
    return {
      id: meta.id,
      file: file,
      name: meta.name,
    }
  })
