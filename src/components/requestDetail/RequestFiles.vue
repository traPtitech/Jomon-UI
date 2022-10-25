<script lang="ts" setup>
import { DocumentIcon } from '@heroicons/vue/24/outline'
import { XCircleIcon } from '@heroicons/vue/24/solid'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import apis from '/@/lib/apis'
import { isImageByName } from '/@/lib/checkFileType'

import SimpleButton from '/@/components/shared/SimpleButton.vue'

import { useRequestFile } from './composables/useRequestFile'

const toast = useToast()
const requestDetailStore = useRequestDetailStore()

const { request } = storeToRefs(requestDetailStore)

const { files, fetchFiles } = useRequestFile()
const downloadLink = (file: string) => {
  return URL.createObjectURL(new Blob([file]))
}

async function removeFile(id: string) {
  const result = confirm('この画像を削除しますか？')
  if (!result) {
    return
  }
  try {
    await apis.deleteFile(id)
    files.value = files.value.filter(file => file.id !== id)
  } catch {
    toast.error('ファイルの削除に失敗しました')
  }
}

await fetchFiles(request.value?.files ?? [])
</script>

<template>
  <div v-if="files.length > 0" class="mx-4 mt-4 flex flex-wrap gap-8">
    <div
      v-for="file in files"
      :key="file.file"
      class="relative flex w-60 flex-col items-center">
      <img v-if="isImageByName(file.name)" :alt="file.name" :src="file.file" />
      <DocumentIcon v-else class="h-32" />
      <!--画像の色によっては見えづらい(新規作成画面も)-->

      <p class="relative mt-2 flex items-center gap-2 break-all">
        {{ file.name }}
        <button
          class="absolute -right-8 h-6 w-6 text-red-500 hover:text-red-300"
          @click="removeFile(file.id)">
          <XCircleIcon />
        </button>
      </p>
      <!--mockの場合は:href="file.file"、本番で動くか不明-->
      <SimpleButton
        v-if="!isImageByName(file.name)"
        font-size="sm"
        padding="sm">
        <a :download="file.name" :href="downloadLink(file.file)">
          ダウンロード
        </a>
      </SimpleButton>
    </div>
  </div>
  <div v-else class="text-center">(画像はありません)</div>
</template>
