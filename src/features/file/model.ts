import { DateTime } from 'luxon'

export interface FileData {
  id: string
  file: File
  name: string
}

export interface FileMeta {
  id: string
  name: string
  mimeType: string
  createdAt: DateTime
}

export interface FileSeed {
  file: File
  name: string
}
