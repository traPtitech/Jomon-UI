import axios from 'axios'
import { defineStore } from 'pinia'

type RequestDetail = {
  id: string
  amount: number
  title: string
  content: string
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
    reason: string
    created_at: string
  }[]
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
  updated_at: string
}

type Log = {
  created_at: Date
  kind: string
  index: number
}

type CommentRequest = {
  comment: string
}
type StatusRequest = {
  status: string
  reason: string
}

export const useRequestDetailStore = defineStore('requestDetail', {
  state: () => ({
    request: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      amount: 1200,
      title: 'SysAd講習会の開催費用',
      content: 'サーバー代 1200円',
      comments: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          user: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          comment: 'コメント内容',
          created_at: '2022-02-12T08:01:38.838Z',
          updated_at: '2022-02-12T08:01:38.838Z'
        }
      ],
      files: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
      statuses: [
        {
          created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          status: 'submitted',
          reason: 'これは雑すぎますね。',
          created_at: '2022-02-12T08:01:37.838Z'
        }
      ],
      tags: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2020講習会',
          description: '2020年度講習会',
          created_at: '2022-02-12T08:01:37.838Z',
          updated_at: '2022-02-12T08:01:37.838Z'
        }
      ],
      group: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'SysAd',
        description: 'SysAd班',
        budget: 250000,
        created_at: '2022-02-12T08:01:37.838Z',
        updated_at: '2022-02-12T08:01:37.838Z'
      },
      created_at: '2022-02-12T08:01:37.838Z',
      updated_at: '2022-02-12T08:01:37.838Z'
    } as RequestDetail
  }),
  getters: {
    dateFormatter() {
      return (date: string) => {
        return (
          date.split('-')[0] +
          '年' +
          date.split('-')[1] +
          '月' +
          date.split('-')[2].split('T')[0] +
          '日'
        )
      }
    },
    logs() {
      let array = new Array<Log>()
      for (let i = 0; i < this.request.comments.length; i++) {
        array = array.concat([
          {
            created_at: new Date(this.request.comments[i].created_at),
            kind: 'comment',
            index: i
          }
        ])
      }
      for (let i = 0; i < this.request.statuses.length; i++) {
        array = array.concat([
          {
            created_at: new Date(this.request.statuses[i].created_at),
            kind: 'statusChange',
            index: i
          }
        ])
      }
      array = array.sort(function (a, b) {
        if (a.created_at > b.created_at) return 1
        if (b.created_at > a.created_at) return -1
        return 0
      })
      return array
    }
  },
  actions: {
    async getRequestDetail(id: string | string[]) {
      const response: RequestDetail = await axios.get('/api/requests/' + id)
      this.request = response
    },
    async postComment(id: string, commentRequest: CommentRequest) {
      await axios.post('/api/requests/' + id + '/comments', commentRequest)
    },
    async putStatus(id: string, statusRequest: StatusRequest) {
      await axios.put('/api/requests/' + id + '/status', statusRequest)
    }
  }
})
