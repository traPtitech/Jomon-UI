//date関連のプロパティをDateTimeに変換した型定義
import type { DateTime } from 'luxon'

import type {
  Status as APIStatus,
  Comment as APIComment,
  RequestDetail as APIRequestDetail,
  Request as APIRequest,
  Transaction as APITransaction
} from '/@/lib/apis'

export interface Request extends Omit<APIRequest, 'created_at' | 'updated_at'> {
  created_at: DateTime
  updated_at: DateTime
}

export interface Comment extends Omit<APIComment, 'created_at' | 'updated_at'> {
  created_at: DateTime
  updated_at: DateTime
}

export interface Status extends Omit<APIStatus, 'created_at'> {
  created_at: DateTime
}

export interface RequestDetail
  extends Omit<
    APIRequestDetail,
    'created_at' | 'updated_at' | 'comments' | 'statuses'
  > {
  created_at: DateTime
  updated_at: DateTime
  comments: Comment[]
  statuses: Status[]
}

export interface Transaction
  extends Omit<APITransaction, 'created_at' | 'updated_at'> {
  created_at: DateTime
  updated_at: DateTime
}
