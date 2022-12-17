import { DateTime } from 'luxon'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import type { Request } from '/@/stores/request'
import { useRequestStore } from '/@/stores/request'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import type { Request as APIRequest, Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'

export interface FileRequest {
  name: string
  src: string
  type: string
}
export interface RequestRequest {
  created_by: string
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

  const { requests } = storeToRefs(requestStore)

  const request = ref<RequestRequest>({
    created_by: userStore.me?.id ?? '',
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
    let tags: Tag[]
    try {
      tags = await tagStore.createTagIfNotExist(request.value.tags)
    } catch {
      return
    }
    const requestRequest = {
      ...request.value,
      tags: tags.map(tag => tag.id),
      group: request.value.group !== '' ? request.value.group : null,
      targets: request.value.targets.map(target => ({
        target: target,
        amount: 0
      }))
    }
    try {
      const response: APIRequest = (await apis.postRequest(requestRequest)).data
      const id = response.id
      const newRequest: Request = {
        ...response,
        created_at: DateTime.fromISO(response.created_at),
        updated_at: DateTime.fromISO(response.updated_at)
      }
      if (requests.value) {
        requests.value.unshift(newRequest)
      } else {
        requests.value = [newRequest]
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
