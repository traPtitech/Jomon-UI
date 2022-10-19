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
  tags: Tag[]
  group: string
}

export const useNewRequest = () => {
  const toast = useToast()
  const router = useRouter()
  const requestStore = useRequestStore()
  const userStore = useUserStore()
  const tagStore = useTagStore()

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
    let tags
    try {
      tags = await tagStore.createTagIfNotExist(request.value.tags)
    } catch {
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
