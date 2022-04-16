import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Comment, Status } from '/@/lib/apis'

export const useRequestDetailStore = defineStore('requestDetail', () => {
  const request = ref({
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    amount: 1200,
    title: 'SysAd講習会の開催費用',
    created_by: 'mehm8128',
    status: 'submitted',
    content: `# aaaaa
- aaa
  - bbb`,
    targets: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        target: 'mehm8128',
        paid_at: '2020-01-01',
        created_at: '2020-01-01'
      }
    ],
    comments: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        user: 'mehm8128',
        comment: '# aaaaa\n- aaa \n  - bbb',
        created_at: '2022-02-11T08:01:38.838Z',
        updated_at: '2022-02-11T08:01:38.838Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        user: 'mehm8128',
        comment: '**コメント内容**',
        created_at: '2022-02-14T08:01:38.838Z',
        updated_at: '2022-02-14T08:01:38.838Z'
      }
    ],
    files: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
    statuses: [
      {
        created_by: 'mehm8128',
        status: 'submitted',
        created_at: '2022-02-12T08:01:37.838Z'
      },
      {
        created_by: 'mehm8128',
        status: 'fix_required',
        created_at: '2022-02-13T08:01:37.838Z'
      },
      {
        created_by: 'mehm8128',
        status: 'submitted',
        created_at: '2022-02-18T08:01:37.838Z'
      }
    ],
    tags: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa5',
        name: '2020講習会',
        description: '2020年度講習会',
        created_at: '2020-02-12T08:01:37.838Z',
        updated_at: '2020-02-12T08:01:37.838Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2021講習会',
        description: '2021年度講習会',
        created_at: '2021-02-12T08:01:37.838Z',
        updated_at: '2021-02-12T08:01:37.838Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: '2022講習会',
        description: '2022年度講習会',
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
  })

  const logs = () => {
    //2つの配列(commentsとstatuses)の中身の型が違うので1つにまとめ、ソートして表示ができない
    const array = new Array<(Comment | Status)[]>()
    //2つの配列からcreated_at、種類、インデックスだけ取り出して1つの配列にまとめる
    // for (let i = 0; i < this.request.comments.length; i++) {
    //   array = array.concat([
    //     {
    //       created_at: new Date(this.request.comments[i].created_at),
    //       kind: 'comment',
    //       index: i
    //     }
    //   ])
    // }
    // for (let i = 0; i < this.request.statuses.length; i++) {
    //   array = array.concat([
    //     {
    //       created_at: new Date(this.request.statuses[i].created_at),
    //       kind: 'statusChange',
    //       index: i
    //     }
    //   ])
    // }
    //created_atでソート
    // array = array.sort(function (a, b) {
    //   if (a.created_at > b.created_at) return 1
    //   if (b.created_at > a.created_at) return -1
    //   return 0
    // })
    return array
    //その後この配列のkindで配列を選び、indexでindexを選ぶことで2つの配列をいい感じに並べ替えられる
  }

  return {}
})
