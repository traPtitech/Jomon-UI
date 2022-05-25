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
    alert(err.response.data)
  }
}
</script>

<template>
  <div class="pt-8 bg-white">
    <h1 class="text-3xl text-center">タグの新規作成</h1>
    <div class="flex flex-col justify-around mx-12 mt-8 h-4/5">
      <div>
        <label>タグの名前：</label>
        <input v-model="tagName" class="border border-gray-300 w-2/3" />
      </div>
      <div class="text-center mt-8">
        <Button class="w-48 mb-4" font-size="xl" padding="sm" @click="postTag">
          タグを作成する
        </Button>
      </div>
    </div>
  </div>
</template>
