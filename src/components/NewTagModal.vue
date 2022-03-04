<script lang="ts" setup>
import { ref } from 'vue'

import { useTagStore } from '../stores/tag'

const tagStore = useTagStore()
const tag = ref({
  name: '',
  description: ''
})
function postTag() {
  tagStore.postTag(tag.value)
}
</script>

<template>
  <div
    class="bg-white w-160 h-90 absolute z-4 inset-0 m-auto border border-solid border-black"
  >
    <h1 class="text-3xl text-center mt-4 mb-4">タグの新規作成</h1>
    <div class="flex flex-col justify-around ml-12 text-xl h-4/5">
      <div>
        <span>タグの名前：</span>
        <input
          v-model="tag.name"
          class="border border-solid border-black w-2/3"
        />
      </div>
      <div>
        <span>詳細：</span>
        <textarea
          v-model="tag.description"
          class="h-32 leading-tight border border-solid border-black resize-none w-2/3"
        />
      </div>
      <div class="text-center">
        <button @click="postTag">タグを作成する</button>
      </div>
    </div>
  </div>
</template>
