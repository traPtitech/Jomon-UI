export type Request = {
  created_by: string
  amount: number
  title: string
  content: string
  targets: string[]
  tags: string[]
  group: string | null
}
export type RequestResponse = {
  id: string
  status: string
  created_at: string
  updated_at: string
  created_by: string
  amount: number
  title: string
  tags: {
    id: string
    name: string
    created_at: string
    updated_at: string
  }[]
  group: {
    id: string
    name: string
    description: string
    budget: number
    created_at: string
    updated_at: string
  }
}

export type Params = {
  sort: string
  current_state: string | null
  target: string | null
  since: string
  until: string
  tag: string | null
  group: string | null
}
