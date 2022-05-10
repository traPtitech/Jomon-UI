<script lang="ts" setup>
import { XCircleIcon } from '@heroicons/vue/solid'
import { openModal } from 'jenesius-vue-modal'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import NewTagModal from '/@/components/modal/NewTagModal.vue'
import Button from '/@/components/shared/Button.vue'
import MarkdownIt from '/@/components/shared/MarkdownIt.vue'
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
const imageExtensions = /.(jpg|png|jpeg|tiff|jfif|tif|webp|avif)$/
const inputImageRef = ref()

const selectedTemplate = ref(null)
const templates = [
  { name: '部費利用申請', value: 'clubBudgetRequest' },
  { name: '交通費申請', value: 'travelingExpenseRequest' }
]

const request = ref({
  created_by: userStore.me.name,
  amount: 0,
  title: '',
  targets: [] as string[],
  content: '',
  tags: [] as string[],
  group: null
} as RequestRequest)
const images = ref([] as File[])

async function postFile(requestId: string, name: string, file: string) {
  await apis.postFile(file, name, requestId)
}

async function postRequestAPI(request: RequestRequest) {
  const requestRequest = {
    ...request,
    group: request.group !== null ? request.group : ''
  }
  const response: Request = (await apis.postRequest(requestRequest)).data
  return response.id
}

async function postRequest() {
  if (
    !/^[1-9][0-9]*$|^0$/.test(request.value.amount.toString()) ||
    !request.value.title ||
    !request.value.content ||
    request.value.targets.length === 0
  ) {
    alert('形式が不正です')
    return
  }
  const id = await postRequestAPI(request.value)
  images.value.forEach(image => {
    postFile(id, image.name, image.src)
  })
  alert('申請を作成しました')
  router.push('/')
}

function handleImageChange(e: Event) {
  if ((e.target as HTMLInputElement).files) {
    for (let i = 0; i < (e.target as HTMLInputElement).files!.length; i++) {
      const file = (e.target as HTMLInputElement).files![i]
      if (file.name.match(imageExtensions)) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          images.value = images.value.concat([
            { name: file.name, src: reader.result!.toString() }
          ])
        }
      } else {
        alert('画像ファイル以外はアップロードできません') //todo:画像以外もどうにかする
      }
    }
    inputImageRef.value.value = null
  }
}

function setTemplate(selectedTemplate: string | null) {
  if (selectedTemplate) {
    request.value.content =
      selectedTemplate === 'clubBudgetRequest'
        ? clubBudgetRequestTemplate
        : selectedTemplate === 'travelingExpenseRequest'
        ? travelingExpenseRequestTemplate
        : ''
  } //todo:switchで書いた方がよさそう
}

function deleteImage(index: number) {
  images.value.splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col mx-auto min-w-160 w-2/3">
    <div class="py-8">
      <h1 class="text-center text-3xl">申請の新規作成</h1>
    </div>
    <div class="flex flex-col gap-2">
      <div class="flex flex-col">
        申請者
        <span class="text-xl">{{ userStore.me.name }}</span>
      </div>
      <div class="flex flex-col">
        <label>タイトル</label>
        <input v-model="request.title" class="border border-gray-300 rounded" />
      </div>
      <div class="flex flex-col">
        <label>金額</label>
        <div>
          <input
            v-model="request.amount"
            class="border border-gray-300 rounded" />円
        </div>
      </div>
      <div class="text-right mr-20">
        <VueSelect
          v-model="selectedTemplate"
          class="w-1/3 inline-block"
          label="name"
          :options="templates"
          placeholder="テンプレートを選択"
          :reduce="(template:any) => template.value"
          @close="setTemplate(selectedTemplate)">
        </VueSelect>
      </div>
      <div class="flex flex-col">
        <label>詳細</label>
        <textarea
          v-model="request.content"
          class="h-40 border border-gray-300 resize-none p-1 rounded" />
      </div>
      <details class="mb-2">
        <summary>MDプレビュー</summary>
        <div
          class="px-2 w-full"
          :class="request.content ? 'border border-gray-200' : ''">
          <MarkdownIt class="w-full" :text="request.content" />
        </div>
      </details>
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
      <div class="flex flex-col">
        <label>画像</label>
        <input
          ref="inputImageRef"
          accept="image/*"
          multiple
          type="file"
          @change="e => handleImageChange(e)" />
      </div>
      <div>
        <div v-if="images.length === 0">画像プレビュー</div>
        <div v-if="images.length !== 0" class="flex flex-wrap">
          <div v-for="(image, index) in images" :key="index" class="relative">
            <img :alt="image.name" class="h-32" :src="image.src" />
            <button
              class="absolute top-0 right-0 w-6 h-6"
              @click="deleteImage(index)">
              <XCircleIcon />
            </button>
          </div>
        </div>
      </div>
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
