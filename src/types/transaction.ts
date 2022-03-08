export type Transaction = {
  id: string
  amount: number
  target: string
  request_id: string
  tags: {
    id: string
    name: string
    description: string
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
  created_at: string
}

export type Params = {
  sort: string
  request_id: string | null
  target: string | null
  year: number | null
  since: string
  until: string
  tag: string | null
  group: string | null
}

export type TransactionRequest = {
  amount: number
  target: string
  request_id: string
  tags: string[]
  group: string
}
