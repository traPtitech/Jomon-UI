export type Group = {
  name: string
  description: string
  budget: number
}
export type Group2 = {
  name: string
  description: string
  budget: number
  owners: string[]
  members: string[]
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
  members: string[]
}
export type OwnersResponse = {
  oweners: string[]
}
