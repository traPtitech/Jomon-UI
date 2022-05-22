import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { RequestDetail, PostRequest } from '/@/lib/apis'
import apis from '/@/lib/apis'

interface File {
  file: string
  name: string
}

export const useRequestDetailStore = defineStore('requestDetail', () => {
  const request = ref<RequestDetail>({
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
        amount: 1200,
        target: 'mehm8128',
        paid_at: '2020-01-01',
        created_at: '2020-01-01'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        amount: 1500,
        target: 'mehm',
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
        created_at: '2020-02-12T08:01:37.838Z',
        updated_at: '2020-02-12T08:01:37.838Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2021講習会',
        created_at: '2021-02-12T08:01:37.838Z',
        updated_at: '2021-02-12T08:01:37.838Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: '2022講習会',
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
  const files = ref<File[]>([])

  const targetIds = computed(() => {
    const targetIds = new Array<string>()

    for (let i = 0; i < request.value.targets.length; i++) {
      targetIds.push(request.value.targets[i].id)
    }
    return targetIds
  })
  const tagIds = computed(() => {
    const tagIds = new Array<string>()
    for (let i = 0; i < request.value.tags.length; i++) {
      tagIds.push(request.value.tags[i].id)
    }
    return tagIds
  })
  const editMode = ref('')
  const editedValue = ref({
    created_by: request.value.created_by,
    amount: request.value.amount,
    title: request.value.title,
    content: request.value.content,
    targets: targetIds,
    tags: tagIds,
    group: request.value.group.id
  })
  function changeEditMode(
    kind: 'title' | 'content' | 'amount' | 'group' | 'tags' | 'targets' | ''
  ) {
    if (
      editMode.value === 'amount' &&
      kind === '' &&
      !/^[1-9][0-9]*$|^0$/.test(editedValue.value.amount.toString())
    ) {
      alert('金額の形式が不正です')
      return
    }
    if (editMode.value !== 'tags' && kind === '') {
      const result = confirm(
        '入出金記録に紐づいている申請のこの情報を変更すると、入出金記録の情報にも変更が反映されます。よろしいですか？'
      )
      if (!result) return
    }
    if (kind !== '') {
      editMode.value = kind
    } else {
      putRequest(request.value.id, editedValue.value)
      editMode.value = ''
    }
  }

  const fetchRequestDetail = async (id: string) => {
    request.value = (await apis.getRequestDetail(id)).data
  }
  const putRequest = async (id: string, willPutRequest: PostRequest) => {
    const res = (await apis.putRequestDetail(id, willPutRequest)).data
    request.value = res
  }
  const fetchFiles = async (ids: string[]) => {
    ids.forEach(async id => {
      files.value.concat((await apis.getFile(id)).data)
    })
  }

  return {
    request,
    files,
    targetIds,
    tagIds,
    editMode,
    editedValue,
    changeEditMode,
    fetchRequestDetail,
    putRequest,
    fetchFiles
  }
})
