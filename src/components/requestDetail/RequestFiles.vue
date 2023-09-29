<script lang="ts" setup>
import { DocumentIcon } from '@heroicons/vue/24/outline'
import { XCircleIcon } from '@heroicons/vue/24/solid'
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import { isImageByName } from '/@/lib/checkFileType'

import SimpleButton from '/@/components/shared/SimpleButton.vue'

import { useRequestFile } from './composables/useRequestFile'

const requestDetailStore = useRequestDetailStore()

const { request } = storeToRefs(requestDetailStore)

const { files, fetchFiles, removeFile } = useRequestFile()
const downloadLink = (file: string) => {
  return URL.createObjectURL(new Blob([file]))
}

await fetchFiles(request.value?.files ?? [])
</script>

<template>
  <div v-if="files.length > 0" class="mx-4 mt-4">
    <details>
      <summary>画像</summary>
      <div class="flex flex-wrap">
        <div
          v-for="file in files"
          :key="file.file"
          class="not-first:ml-2 relative flex flex-col items-center">
          <img
            v-if="isImageByName(file.name)"
            :alt="file.name"
            :src="file.file" />
          <DocumentIcon v-else class="h-32" />
          <!--画像の色によっては見えづらい(新規作成画面も)-->
          <button
            class="absolute top-0 right-0 h-8 w-8"
            @click="removeFile(file.id)">
            <XCircleIcon />
          </button>
          <!--mockの場合は:href="file.file"、本番で動くか不明-->
          {{ file.name }}
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
    </details>
  </div>
  <div v-else class="text-center">(画像はありません)</div>
</template>
