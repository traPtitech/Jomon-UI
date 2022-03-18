<script lang="ts" setup>
import { XCircleIcon } from '@heroicons/vue/solid'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import clubBudgetRequestTemplate from '../md/clubBudgetRequest.md?raw'
import travelingExpenseRequestTemplate from '../md/travelingExpenseRequest.md?raw'
import { useFileStore } from '../stores/file'
import { useGroupStore } from '../stores/group'
import { useRequestStore } from '../stores/request'
import { useTagStore } from '../stores/tag'
import { useUserStore } from '../stores/user'
import { File } from '../types/fileTypes'
import { Request } from '../types/requestsTypes'
import MarkdownIt from './MarkdownIt.vue'
import NewTagModal from './NewTagModal.vue'
import VueSelect from './VueSelect.vue'

const requestStore = useRequestStore()
const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const fileStore = useFileStore()
const { isModalOpen2 } = storeToRefs(requestStore)
const imageExtensions = /.(jpg|png|jpeg|tiff|jfif|tif|webp|vif)$/
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
} as Request)
const images = ref([] as File[])

async function postRequest() {
  if (/^[1-9][0-9]*$|^0$/.test(request.value.amount.toString())) {
    const id = await requestStore.postRequest(request.value)
    for (let i = 0; i < images.value.length; i++) {
      fileStore.postFile(id, images.value[i].name, images.value[i].src)
    }
  } else {
    alert('金額が不正です')
  }
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
        alert('画像ファイル以外はアップロードできません')
      }
    }
    inputImageRef.value.value = null
  }
}
function handleTagModalIsOpen() {
  isModalOpen2.value = !isModalOpen2.value
}
function setTemplate(selectedTemplate: string | null) {
  if (selectedTemplate) {
    request.value.content =
      selectedTemplate === 'clubBudgetRequest'
        ? clubBudgetRequestTemplate
        : selectedTemplate === 'travelingExpenseRequest'
        ? travelingExpenseRequestTemplate
        : ''
  }
}
function deleteImage(index: number) {
  images.value.splice(index, 1)
}
</script>

<template>
  <NewTagModal v-if="isModalOpen2" />
  <div
    class="bg-white w-300 h-180 absolute z-3 inset-0 m-auto overflow-y-scroll"
  >
    <h1 class="text-3xl text-center mt-4 mb-4">申請の新規作成</h1>
    <div class="flex flex-col justify-between ml-12 h-4/5">
      <span class="text-xl mb-2">申請者：{{ userStore.me.name }}</span>
      <div class="mb-2">
        <span class="text-xl">タイトル：</span>
        <input
          v-model="request.title"
          class="border border-solid border-black w-4/5"
        />
      </div>
      <div class="mb-2">
        <span class="text-xl">金額：</span>
        <input
          v-model="request.amount"
          class="border border-solid border-black"
        />円
      </div>
      <div class="text-right mr-20 mb-2">
        <VueSelect
          v-model="selectedTemplate"
          @close="setTemplate(selectedTemplate)"
          :options="templates"
          :reduce="(template:any) => template.value"
          label="name"
          placeholder="テンプレートを選択"
          class="w-1/3 inline-block"
        >
        </VueSelect>
      </div>
      <div>
        <span class="text-xl align-top">詳細：</span>
        <textarea
          v-model="request.content"
          class="h-60 leading-tight border border-solid border-black resize-none w-4/5 p-1"
        />
      </div>
      <details class="mb-2">
        <summary>MDプレビュー</summary>
        <!--幅を広くしたいけどなぜかできない-->
        <div
          :class="request.content ? 'border border-solid border-gray-200' : ''"
          class="pl-2 pr-2 w-4/5"
        >
          <MarkdownIt :text="request.content" class="w-full" />
        </div>
      </details>
      <div class="mb-2">
        <span class="text-xl">払い戻し対象者：</span>
        <VueSelect
          v-model="request.targets"
          :options="userStore.users"
          :reduce="(user:any) => user.name"
          label="name"
          placeholder="払い戻し対象者"
          multiple
          :closeOnSelect="false"
          class="w-2/3 inline-block"
        ></VueSelect>
      </div>
      <div class="mb-2">
        <span class="text-xl">グループ：</span>
        <VueSelect
          v-model="request.group"
          :options="groupStore.groups"
          :reduce="(group:any) => group.id"
          label="name"
          placeholder="グループ"
          class="w-1/3 inline-block"
        ></VueSelect>
      </div>
      <div class="mb-2">
        <span class="text-xl">タグ：</span>
        <VueSelect
          v-model="request.tags"
          :options="tagStore.tags"
          :reduce="(tag:any) => tag.id"
          label="name"
          placeholder="タグ"
          multiple
          :closeOnSelect="false"
          class="w-2/3 inline-block"
        ></VueSelect>
        <button
          @click="handleTagModalIsOpen"
          class="border border-solid border-black ml-8 text-xl"
        >
          タグを新規作成
        </button>
      </div>
      <div class="mb-4">
        <span class="text-xl">画像：</span>
        <input
          type="file"
          @change="e => handleImageChange(e)"
          multiple
          accept="image/*"
          ref="inputImageRef"
        />
      </div>
      <div>
        <div
          v-if="images.length === 0"
          :class="images.length === 0 ? 'h-32' : ''"
        >
          <span>画像プレビュー</span>
        </div>
        <div v-if="images.length !== 0" class="flex">
          <div v-for="(image, index) in images" class="relative">
            <img :src="image.src" :alt="image.name" class="h-32" />
            <button
              @click="deleteImage(index)"
              class="absolute top-0 right-0 w-6 h-6"
            >
              <XCircleIcon />
            </button>
          </div>
        </div>
      </div>
      <div class="text-center">
        <button @click="postRequest" class="w-32 text-xl mb-4">
          申請を作成する
        </button>
      </div>
    </div>
  </div>
</template>
