<script lang="ts" setup>
import { ref } from 'vue'

import { useFileStore } from '../stores/file'
import { useGroupStore } from '../stores/group'
import { useRequestStore } from '../stores/request'
import { useTagStore } from '../stores/tag'
import { useUserStore } from '../stores/user'
import { Request } from '../types/requestTypes'
import MarkdownIt from './MarkdownIt.vue'
import NewTagModal from './NewTagModal.vue'
import VueSelect from './VueSelect.vue'

const requestStore = useRequestStore()
const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const fileStore = useFileStore()

const request = ref({
  created_by: userStore.me.name,
  amount: 0,
  title: '',
  targets: [] as string[],
  content: '',
  tags: [] as string[],
  group: null
} as Request)
const image = ref()
const imageName = ref('')
const isTagModalOpen = ref(false)

async function postRequest() {
  const id = await requestStore.postRequest(request.value)
  fileStore.postFile(id, imageName.value, image.value)
}
function handleImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files![0]
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    image.value = reader.result
    imageName.value = file.name
  }
}
function handleTagModalIsOpen() {
  isTagModalOpen.value = !isTagModalOpen.value
}
</script>

<template>
  <NewTagModal v-if="isTagModalOpen" />
  <div
    class="bg-white w-300 h-150 absolute z-3 inset-0 m-auto border border-solid border-black overflow-y-scroll"
  >
    <div
      :class="
        isTagModalOpen
          ? 'absolute h-screen w-full z-2 bg-gray-500 opacity-50'
          : ''
      "
      @click="isTagModalOpen = false"
    ></div>
    <h1 class="text-3xl text-center mt-4 mb-4">申請の新規作成</h1>
    <div class="flex flex-col justify-between ml-12 h-4/5">
      <span class="text-xl">申請者：{{ userStore.me.name }}</span>
      <div>
        <span class="text-xl">タイトル：</span>
        <input
          v-model="request.title"
          class="border border-solid border-black w-4/5"
        />
      </div>
      <div>
        <span class="text-xl">金額：</span>
        <input
          v-model="request.amount"
          class="border border-solid border-black"
        /><!-- //ToDo:バリデーション -->
      </div>
      <div>
        <span class="text-xl">詳細：</span>
        <textarea
          v-model="request.content"
          class="h-32 leading-tight border border-solid border-black resize-none w-4/5"
        />
      </div>
      <details>
        <summary>MDプレビュー</summary>
        <!--幅を広くしたいけどなぜかできない-->
        <div
          :class="request.content ? 'border border-solid border-gray-200' : ''"
          class="pl-2 pr-2 w-4/5"
        >
          <MarkdownIt :text="request.content" class="w-full" />
        </div>
      </details>
      <div>
        <span class="text-xl">払い戻し対象者：</span>
        <VueSelect
          v-model="request.targets"
          :options="userStore.users"
          :reduce="(user:any) => user.name"
          label="name"
          placeholder="払い戻し対象者"
          multiple
          :closeOnSelect="false"
          class="w-2/3"
        ></VueSelect>
      </div>

      <div>
        <span class="text-xl">グループ：</span>
        <VueSelect
          v-model="request.group"
          :options="groupStore.groups"
          :reduce="(group:any) => group.id"
          label="name"
          placeholder="グループ"
          class="w-2/3"
        ></VueSelect>
      </div>
      <div>
        <span class="text-xl">タグ：</span>
        <VueSelect
          v-model="request.tags"
          :options="tagStore.tags"
          :reduce="(tag:any) => tag.id"
          label="name"
          placeholder="タグ"
          multiple
          :closeOnSelect="false"
          class="w-2/3"
        ></VueSelect>
        <button
          @click="handleTagModalIsOpen"
          class="border border-solid border-black ml-8 text-xl"
        >
          タグを新規作成
        </button>
      </div>
      <div>
        <span class="text-xl">画像：</span>
        <input type="file" @change="e => handleImageChange(e)" />
      </div>
      <div>
        <img v-if="image" :src="image" :alt="imageName" class="h-32" />
      </div>
      <div class="text-center">
        <button @click="postRequest" class="w-32 text-xl mb-4">
          申請を作成する
        </button>
      </div>
    </div>
  </div>
</template>
