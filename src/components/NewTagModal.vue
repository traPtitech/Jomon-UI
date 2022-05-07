<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import Button from './shared/Button.vue'
import Modal from './shared/Modal.vue'
import apis from '/@/lib/apis'
import { useGeneralStore } from '/@/stores/general'
import { useTagStore } from '/@/stores/tag'

const generalStore = useGeneralStore()
const { isModalOpen2 } = storeToRefs(generalStore)
const tagStore = useTagStore()
const tagName = ref('')

async function postTagAPI(tag: string) {
  await apis.postTag({ name: tag })
  tagStore.fetchTags()
}
function postTag() {
  if (tagName.value !== '') {
    postTagAPI(tagName.value)
    isModalOpen2.value = false
  }
}
</script>

<template>
  <Modal :layer="2" size="sm">
    <div class="pt-8">
      <h1 class="text-3xl text-center">タグの新規作成</h1>
      <div class="flex flex-col justify-around mx-12 mt-8 h-4/5">
        <div>
          <label>タグの名前：</label>
          <input v-model="tagName" class="border border-gray-300 w-2/3" />
        </div>
        <div class="text-center mt-8">
          <Button
            class="w-48 mb-4"
            font-size="xl"
            padding="sm"
            @click="postTag">
            タグを作成する
          </Button>
        </div>
      </div>
    </div>
  </Modal>
</template>
