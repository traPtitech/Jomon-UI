<script lang="ts" setup>
import axios from 'axios'
import { ref } from 'vue'

import { useTagStore } from '../stores/tag'
import Button from './shared/Button.vue'
import Modal from './shared/Modal.vue'

const tagStore = useTagStore()
const tagName = ref('')

async function postTagAPI(tag: string) {
  await axios.post('/api/tags', tag)
  tagStore.getTags()
}
function postTag() {
  postTagAPI(tagName.value)
}
</script>

<template>
  <Modal :width="160" :height="80" :layer="2">
    <h1 class="text-3xl text-center mt-4 mb-4">タグの新規作成</h1>
    <div class="flex flex-col justify-around ml-12 mr-12 text-xl h-4/5">
      <div>
        <span>タグの名前：</span>
        <input v-model="tagName" class="border border-gray-300 w-2/3" />
      </div>
      <div class="text-center">
        <Button @onClick="postTag" fontSize="xl" padding="sm" class="w-48 mb-4">
          タグを作成する</Button
        >
      </div>
    </div>
  </Modal>
</template>
