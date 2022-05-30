<script lang="ts" setup>
import { openModal } from 'jenesius-vue-modal'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import NewRequestImageForm from '../components/NewRequestImageForm.vue'
import MarkdownTextarea from '../components/shared/MarkdownTextarea.vue'
import NewTagModal from '/@/components/modal/NewTagModal.vue'
import Button from '/@/components/shared/Button.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import type { Request } from '/@/lib/apis'
import apis from '/@/lib/apis'
import clubBudgetRequestTemplate from '/@/md/clubBudgetRequest.md?raw'
import travelingExpenseRequestTemplate from '/@/md/travelingExpenseRequest.md?raw'
import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

interface File {
  name: string
  src: string
}
interface RequestRequest {
  created_by: string
  amount: number
  title: string
  content: string
  targets: string[]
  tags: string[]
  group: string | null
}

const router = useRouter()
const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()

const templates = [
  { name: '部費利用申請', value: clubBudgetRequestTemplate },
  { name: '交通費申請', value: travelingExpenseRequestTemplate }
]

const request = ref<RequestRequest>({
  created_by: userStore.me.name,
  amount: 0,
  title: '',
  targets: [],
  content: '',
  tags: [],
  group: null
})
const images = ref<File[]>([])

async function postFile(requestId: string, name: string, file: string) {
  await apis.postFile(file, name, requestId)
}

async function postRequest() {
  if (
    !/^[1-9][0-9]*$|^0$/.test(request.value.amount.toString()) ||
    request.value.title !== '' ||
    request.value.content !== '' ||
    request.value.targets.length === 0
  ) {
    alert('形式が不正です')
    return
  }
  const requestRequest = {
    ...request.value,
    group: request.value.group !== null ? request.value.group : ''
  }
  try {
    const response: Request = (await apis.postRequest(requestRequest)).data
    const id = response.id
    try {
      images.value.forEach(image => {
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
  <div class="flex flex-col mx-auto min-w-160 w-2/3 pt-8 px-12">
    <div class="pb-8">
      <h1 class="text-center text-3xl">申請の新規作成</h1>
    </div>
    <div class="flex flex-col gap-2">
      <div class="flex flex-col">
        申請者
        <span class="text-xl">{{ userStore.me.name }}</span>
      </div>
      <div class="flex flex-col">
        <label>タイトル</label>
        <input
          v-model="request.title"
          class="h-8 p-1 border border-gray-300 rounded" />
      </div>
      <div class="flex flex-col">
        <label>金額</label>
        <div>
          <input
            v-model="request.amount"
            class="h-8 p-1 border border-gray-300 rounded" />円
        </div>
      </div>
      <div class="flex flex-col">
        <label>詳細</label>
        <MarkdownTextarea
          placeholder=""
          :templates="templates"
          :value="request.content"
          @input="request.content = $event" />
      </div>
      <div class="flex flex-col">
        <label>払い戻し対象者</label>
        <VueSelect
          v-model="request.targets"
          :close-on-select="false"
          label="name"
          multiple
          :options="userStore.users"
          placeholder="払い戻し対象者を選択"
          :reduce="(user:any) => user.name" />
      </div>
      <div class="flex flex-col">
        <label>グループ</label>
        <VueSelect
          v-model="request.group"
          label="name"
          :options="groupStore.groups"
          placeholder="グループを選択"
          :reduce="(group:any) => group.id" />
      </div>
      <div class="flex flex-col">
        <label>タグ</label>
        <div class="flex">
          <VueSelect
            v-model="request.tags"
            class="w-2/3"
            :close-on-select="false"
            label="name"
            multiple
            :options="tagStore.tags"
            placeholder="タグを選択"
            :reduce="(tag:any) => tag.id" />
          <Button
            class="ml-8"
            font-size="lg"
            padding="sm"
            @click.stop="openModal(NewTagModal)">
            タグを新規作成
          </Button>
        </div>
      </div>
      <NewRequestImageForm :images="images" @input="images = $event" />
      <div class="text-right">
        <Button
          class="w-48 mb-4"
          font-size="xl"
          padding="sm"
          @click.stop="postRequest">
          申請を作成する
        </Button>
      </div>
    </div>
  </div>
</template>
