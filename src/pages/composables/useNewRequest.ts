import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useRequestStore } from '/@/stores/request'
import type { RequestRequest } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import type { Request as APIRequest, Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { convertRequest } from '/@/lib/date'

export interface FileRequest {
  name: string
  src: string
  type: string
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
    targets: [{ target: '', amount: 0 }],
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
      toast.warning('タイトル、詳細、対象者は必須です')
      return
    }
    if (
      request.value.targets.some(
        target => target.target === '' || target.amount === 0
      )
    ) {
      toast.warning('対象者の選択と金額の入力は必須です')
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
      group: request.value.group !== '' ? request.value.group : null
    }
    try {
      const response: APIRequest = (await apis.postRequest(requestRequest)).data
      const newRequest = convertRequest(response)
      if (requests.value) {
        requests.value.unshift(newRequest)
      } else {
        requests.value = [newRequest]
      }
      try {
        files.value.forEach((file: FileRequest) => {
          postFile(response.id, file.name, file.src)
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
