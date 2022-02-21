<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { useFileStore } from '../stores/file'
import { useGroupStore } from '../stores/group'
import { useRequestStore } from '../stores/request'
import { useTagStore } from '../stores/tag'
import { useUserStore } from '../stores/user'
import NewTagModal from './NewTagModal.vue'

const requestStore = useRequestStore()
const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const fileStore = useFileStore()
const { me } = storeToRefs(userStore)
const { tags } = storeToRefs(tagStore)
const { groups } = storeToRefs(groupStore)
const request = ref({
  created_by: me.value.name,
  amount: 0,
  title: '',
  comment: '',
  tags: [] as string[],
  group: null
})
const image = ref()
const isTagModalOpen = ref(false)
function postRequest() {
  console.log(request.value)
  alert(
    'ここでrequestの送信、レスポンスのrequestIdを使って画像を送信\nまた、タグやグループの新規作成があれば先に送っておいてレスポンスのidを使ってrequestを送る'
  )
}
function handleImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files![0]
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    image.value = reader.result
  }
  fileStore.postFile('aaa', file.name, image.value)
}
function handleTagModalIsOpen() {
  isTagModalOpen.value = !isTagModalOpen.value
}
</script>

<template>
  <NewTagModal v-if="isTagModalOpen" />
  <div
    class="bg-white w-240 h-120 absolute z-3 inset-0 m-auto border border-solid border-black"
  >
    <div
      :class="
        isTagModalOpen
          ? 'absolute h-full w-full z-2 bg-gray-500 opacity-50'
          : ''
      "
      @click="isTagModalOpen = false"
    ></div>
    <h1 class="text-3xl text-center mt-4 mb-4">申請の新規作成</h1>
    <div class="flex flex-col justify-between ml-12 text-xl h-4/5">
      <span>申請者：{{ me.name }}</span>
      <div>
        <span>タイトル：</span>
        <input
          v-model="request.title"
          class="border border-solid border-black w-4/5"
        />
      </div>
      <div>
        <span>金額：</span>
        <input
          v-model="request.amount"
          class="border border-solid border-black"
        />
      </div>
      <div>
        <span>詳細：</span>
        <textarea
          v-model="request.comment"
          class="border border-solid border-black resize-none w-4/5"
        />
      </div>
      <div>
        <span>タグ：</span>
        <v-select
          v-model="request.tags"
          :options="tags"
          :reduce="(tag:any) => tag.id"
          label="name"
          placeholder="タグ"
          multiple
          class="w-2/3"
        ></v-select>
        <button
          @click="handleTagModalIsOpen"
          class="border border-solid border-black ml-8"
        >
          タグを新規作成
        </button>
      </div>
      <div>
        <span>グループ：</span>
        <v-select
          v-model="request.group"
          :options="groups"
          :reduce="(group:any) => group.id"
          label="name"
          placeholder="グループ"
          class="w-2/3"
        ></v-select>
      </div>
      <div>
        <span>画像：</span>
        <input type="file" @change="e => handleImageChange(e)" />
      </div>
      <div>
        <img v-if="image" :src="image" alt="uploadedFile" class="h-32" />
      </div>
      <div class="text-center">
        <button @click="postRequest" class="w-32">申請を作成する</button>
      </div>
    </div>
  </div>
</template>
