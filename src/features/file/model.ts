export interface File {
  id: string
  file: string
  name: string
}

export interface FileMeta {
  id: string
  name: string
  mimeType: string
}

export interface FileSeed {
  name: string
  src: string
  type: string
}
