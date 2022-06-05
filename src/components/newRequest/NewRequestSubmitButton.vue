<script lang="ts" setup>
import { useRouter } from 'vue-router'

import Button from '/@/components/shared/Button.vue'
import type { Request } from '/@/lib/apis'
import apis from '/@/lib/apis'

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
  const requestRequest = {
    ...props.request,
    group: props.request.group !== null ? props.request.group : ''
  }
  try {
    const response: Request = (await apis.postRequest(requestRequest)).data
    const id = response.id
    try {
      props.images.forEach((image: File) => {
        postFile(id, image.name, image.src)
      })
      alert('申請を作成しました')
      router.push('/')
    } catch (err: any) {
      alert(err.response.data)
    }
  } catch (err: any) {
    alert(err.response.data)
  }
}
</script>

<template>
  <div class="text-right">
    <Button
      class="w-48 mb-4"
      font-size="xl"
      padding="sm"
      @click.stop="postRequest">
      申請を作成する
    </Button>
  </div>
</template>
