<script lang="ts" setup>
import { useApplicationFile } from './composables/useApplicationFile'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { useApplicationStore } from '@/features/application/store'
import { isImageByName } from '@/lib/checkFileType'
import { DocumentIcon } from '@heroicons/vue/24/outline'
import { XCircleIcon } from '@heroicons/vue/24/solid'

const { currentApplication: application } = useApplicationStore()

const { files, fetchFiles, removeFile } = useApplicationFile()
const downloadLink = (file: string) => {
  return URL.createObjectURL(new Blob([file]))
}

await fetchFiles(application.value?.files ?? [])
</script>

<template>
  <div v-if="files.length > 0" class="mx-4 mt-4">
    <details>
      <summary>画像</summary>
      <div class="flex flex-wrap">
        <div
          v-for="file in files"
          :key="file.id"
          class="relative flex flex-col items-center not-first:ml-2">
          <img
            v-if="isImageByName(file.name)"
            :alt="file.name"
            :src="file.id" />
          <DocumentIcon v-else class="h-32" />
          <!--画像の色によっては見えづらい(新規作成画面も)-->
          <button
            class="absolute top-0 right-0 h-8 w-8"
            type="button"
            @click="removeFile(file.id)">
            <XCircleIcon />
          </button>
          <!--mockの場合は:href="file.file"、本番で動くか不明-->
          {{ file.name }}
          <SimpleButton
            v-if="!isImageByName(file.name)"
            font-size="sm"
            padding="sm">
            <a :download="file.name" :href="downloadLink(file.id)">
              ダウンロード
            </a>
          </SimpleButton>
        </div>
      </div>
    </details>
  </div>
  <div v-else class="text-center">(画像はありません)</div>
</template>
