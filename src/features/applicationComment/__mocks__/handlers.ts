import type { Comment } from '@/lib/apis'

import { mockUserMehm8128 } from '@/features/user/__mocks__/handlers'

export const mockApplicationComment: Comment = {
  id: mockUserMehm8128.id,
  user: mockUserMehm8128.id,
  comment: '# aaaaa\n- aaa \n  - bbb',
  created_at: '2022-02-11T08:01:38.838Z',
  updated_at: '2022-02-11T08:01:38.838Z',
}

export const mockApplicationComments: Comment[] = [
  {
    id: mockUserMehm8128.id,
    user: mockUserMehm8128.id,
    comment: '# aaaaa\n- aaa \n  - bbb',
    created_at: '2022-02-11T08:01:38.838Z',
    updated_at: '2022-02-11T08:01:38.838Z',
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    user: mockUserMehm8128.id,
    comment: '**コメント内容**',
    created_at: '2022-02-14T08:01:38.838Z',
    updated_at: '2022-02-14T08:01:38.838Z',
  },
]
