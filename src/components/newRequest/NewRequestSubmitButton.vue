<script lang="ts" setup>
import type { AxiosResponse } from 'axios'
import { useRouter } from 'vue-router'

import SimpleButton from '../shared/SimpleButton.vue'
import type { Request, Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { useRequestStore } from '/@/stores/request'

interface RequestRequest {
  created_by: string
  amount: number
  title: string
  content: string
  targets: string[]
  tags: string[]
  group: string | null
}
interface File {
  name: string
  src: string
}

const props = defineProps<{
  request: RequestRequest
  images: File[]
}>()
const router = useRouter()

const requestStore = useRequestStore()

async function postFile(requestId: string, name: string, file: string) {
  await apis.postFile(file, name, requestId)
}
async function postRequest() {
  if (
    !/^[1-9][0-9]*$|^0$/.test(props.request.amount.toString()) ||
    props.request.title === '' ||
    props.request.content === '' ||
    props.request.targets.length === 0
  ) {
    alert('形式が不正です')
    return
  }
  const tagPostPromises: Promise<AxiosResponse<Tag, any>>[] = []
  props.request.tags.forEach((tag: string) => {
    if (tag === '') {
      return
    }
    tagPostPromises.push(apis.postTag({ name: tag }))
  })
  let tags: string[] = []
  try {
    tags = (await Promise.all(tagPostPromises)).map(
      (tag: AxiosResponse<Tag, any>) => tag.data.id
    )
  } catch (err) {
    alert(err)
    return
  }
  const requestRequest = {
    ...props.request,
    tags: [...props.request.tags, ...tags],
    group: props.request.group !== null ? props.request.group : ''
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
      props.images.forEach((image: File) => {
        postFile(id, image.name, image.src)
      })
      alert('申請を作成しました')
      router.push('/')
    } catch (err) {
      alert(err)
    }
  } catch (err) {
    alert(err)
  }
}
</script>

<template>
  <div class="text-right">
    <simple-button
      class="mb-4"
      font-size="xl"
      padding="md"
      @click.stop="postRequest">
      申請を作成する
    </simple-button>
  </div>
</template>
