export type Group = {
  name: string
  description: string
  budget: number
}
export type GroupResponse = {
  id: string
  name: string
  description: string
  budget: number
  created_at: string
  updated_at: string
}
export type GroupsResponse = {
  groups: GroupResponse[]
}

export type Member = {
  id: string
}
export type MembersResponse = {
  members: Member[]
}
export type OwnersResponse = {
  oweners: Member[]
}
