export type TagResponse = {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}
export type TagsResponse = {
  tags: TagResponse[]
}
export type Tag = {
  name: string
  description: string
}
