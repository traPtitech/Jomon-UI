import { GroupResponse } from './groupTypes'
import { TagResponse } from './tagTypes'

export type RequestDetailResponse = {
  id: string
  amount: number
  title: string
  created_by: string
  status: string
  content: string
  targets: TargetResponse[]
  comments: {
    id: string
    user: string
    comment: string
    created_at: string
    updated_at: string
  }[]
  files: string[]
  statuses: {
    created_by: string
    status: string
    created_at: string
  }[]
  tags: TagResponse[]
  group: GroupResponse
  created_at: string
  updated_at: string
}
export type TargetResponse = {
  id: string
  target: string
  paid_at: string
  created_at: string
}

export type Request2 = {
  created_by: string
  amount: number
  title: string
  content: string
  targets: string[]
  tags: TagResponse[]
  group: string | null
}

export type Log = {
  created_at: Date
  kind: string
  index: number
}

export type Comment = {
  comment: string
}
export type Status = {
  status: string
}
