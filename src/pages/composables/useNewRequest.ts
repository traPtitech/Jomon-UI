import type { AxiosResponse } from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useRequestStore } from '/@/stores/request'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import type { Request, Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'

export interface FileRequest {
  name: string
  src: string
  type: string
}
export interface RequestRequest {
  created_by: string
  amount: number
  title: string
  content: string
  targets: string[]
  tags: string[]
  group: string
}

export const useNewRequest = () => {
  const toast = useToast()
  const router = useRouter()
  const tagStore = useTagStore()
  const requestStore = useRequestStore()
  const userStore = useUserStore()

  const request = ref<RequestRequest>({
    created_by: userStore.me?.name ?? '',
    amount: 0,
    title: '',
    targets: [],
    content: '',
    tags: [],
    group: ''
  })
  const files = ref<FileRequest[]>([])

  const postFile = async (requestId: string, name: string, file: string) => {
    await apis.postFile(file, name, requestId)
  }

  const postRequest = async () => {
    if (
      request.value.title === '' ||
      request.value.content === '' ||
      request.value.targets.length === 0
    ) {
      toast.warning('タイトル、内容、対象者は必須です')
      return
    }
    const postTagResults: ReturnType<typeof apis.postTag>[] = []
    let tags: string[] = []
    // 以下の2パターンで場合分けしていて、条件式が1でtrue、2でfalseになる
    // 1. willPutRequest.tagsに入っているidがtagStore.tagsのタグのidと一致する
    // 2. タグが新規作成されて、そのタグ名がwillPutRequest.tagsに入っている
    // 2の場合にはタグ名がtagStore.tagsのタグidと一致することはないので、tagPostPromisesにpostTag関数がpushされる
    request.value.tags.forEach((tag: string) => {
      if (tagStore.tags?.some(t => t.id === tag)) {
        tags.push(tag)
        return
      }
      postTagResults.push(apis.postTag({ name: tag }))
    })
    try {
      tags = tags.concat(
        (await Promise.all(postTagResults)).map(
          (tag: AxiosResponse<Tag>) => tag.data.id
        )
      )
    } catch {
      toast.error('申請の作成に失敗しました')
      return
    }

    const requestRequest = {
      ...request.value,
      tags: tags,
      group: request.value.group
    }
    try {
      const response: Request = (await apis.postRequest(requestRequest)).data
      const id = response.id
      if (requestStore.requests) {
        requestStore.requests.unshift(response)
      } else {
        requestStore.requests = [response]
      }
      try {
        files.value.forEach((file: FileRequest) => {
          postFile(id, file.name, file.src)
        })
        toast.success('申請を作成しました')
        router.push('/')
      } catch {
        toast.error('申請の作成に失敗しました')
      }
    } catch {
      toast.error('申請の作成に失敗しました')
    }
  }
  return { request, files, postRequest }
}
