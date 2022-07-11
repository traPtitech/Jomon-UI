<script lang="ts" setup>
import { closeModal } from 'jenesius-vue-modal'
import { ref } from 'vue'

import Button from '/@/components/shared/Button.vue'
import apis from '/@/lib/apis'
import { useTagStore } from '/@/stores/tag'

const tagStore = useTagStore()
const tagName = ref('')

async function postTag() {
  if (tagName.value === '') {
    alert('1文字以上入力してください')
    return
  }
  try {
    const response = (await apis.postTag({ name: tagName.value })).data
    tagStore.tags.push(response)
    closeModal()
  } catch (err: any) {
    alert(err.message)
  }
}
</script>

<template>
  <div class="bg-white pt-8">
    <h1 class="text-center text-3xl">タグの新規作成</h1>
    <div class="flex flex-col h-4/5 mx-12 mt-8 justify-around">
      <div>
        <label>タグの名前：</label>
        <input v-model="tagName" class="border border-gray-300 w-2/3" />
      </div>
      <div class="mt-8 text-center">
        <Button class="mb-4 w-48" font-size="xl" padding="sm" @click="postTag">
          タグを作成する
        </Button>
      </div>
    </div>
  </div>
</template>
