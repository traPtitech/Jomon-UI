<script lang="ts" setup>
import type { AxiosResponse } from 'axios'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useRequestStore } from '/@/stores/request'
import { useTagStore } from '/@/stores/tag'

import type { Request, Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'

import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { FileRequest, RequestRequest } from '/@/pages/NewRequestPage.vue'

const props = defineProps<{
  request: RequestRequest
  files: FileRequest[]
}>()

const router = useRouter()

const requestStore = useRequestStore()
const tagStore = useTagStore()
const toast = useToast()

async function postFile(requestId: string, name: string, file: string) {
  await apis.postFile(file, name, requestId)
}
async function postRequest() {
  if (
    props.request.title === '' ||
    props.request.content === '' ||
    props.request.targets.length === 0
  ) {
    toast.warning('タイトル、内容、対象者は必須です')
    return
  }
  const tagPostPromises: Promise<AxiosResponse<Tag>>[] = []
  let preTags: string[] = []
  // タグが新規作成されている(tagStore.tagsに存在しないidである)場合に、タグを作成する
  props.request.tags.forEach((tag: string) => {
    if (tagStore.tags?.some(t => t.id === tag)) {
      preTags.push(tag)
      return
    }
    tagPostPromises.push(apis.postTag({ name: tag }))
  })
  try {
    preTags = preTags.concat(
      (await Promise.all(tagPostPromises)).map(
        (tag: AxiosResponse<Tag>) => tag.data.id
      )
    )
  } catch {
    toast.error('申請の作成に失敗しました')
    return
  }

  const requestRequest = {
    ...props.request,
    tags: preTags,
    group: props.request.group
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
      props.files.forEach((file: FileRequest) => {
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
</script>

<template>
  <div class="text-right">
    <SimpleButton
      class="mb-4"
      font-size="xl"
      padding="md"
      @click.stop="postRequest">
      申請を作成する
    </SimpleButton>
  </div>
</template>
