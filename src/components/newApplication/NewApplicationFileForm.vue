<script lang="ts" setup>
import type { FileSeed } from '@/features/file/entities'
import { isImageByType } from '@/lib/checkFileType'
import { DocumentIcon } from '@heroicons/vue/24/outline'
import { XCircleIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'

const files = defineModel<FileSeed[]>({ required: true })

const inputRef = ref()
const filePreviewUrls = ref<string[]>([])

async function handleFileChange(e: Event) {
  if (!(e.target instanceof HTMLInputElement) || !e.target.files) {
    return
  }

  const newFiles = await Promise.all(
    Array.from(e.target.files).map(file => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      return new Promise<{ fileSeed: FileSeed; previewUrl: string }>(
        resolve => {
          reader.onload = () => {
            resolve({
              fileSeed: { name: file.name, file: file },
              previewUrl: reader.result as string
            })
          }
        }
      )
    })
  )
  files.value.push(...newFiles.map(file => file.fileSeed))
  filePreviewUrls.value.push(...newFiles.map(file => file.previewUrl))

  if (inputRef.value) {
    inputRef.value.value = null
  }
}

function removeFile(index: number) {
  files.value.splice(index, 1)
  filePreviewUrls.value.splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium" for="image">画像</label>
    <input
      id="image"
      ref="inputRef"
      multiple
      type="file"
      class="flex w-fit items-center rounded-md border border-surface-secondary px-2 py-1 hover:bg-hover-primary focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
      @change="handleFileChange" />
  </div>
  <div>
    <div v-if="files.length === 0" class="text-sm font-medium">
      画像プレビュー
    </div>
    <div v-if="files.length !== 0" class="flex flex-wrap">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="group relative flex flex-col items-center not-first:ml-2">
        <img
          v-if="isImageByType(file.file.type)"
          :alt="file.name"
          class="h-32"
          :src="filePreviewUrls[index]" />
        <DocumentIcon v-else class="h-32" />
        <button
          aria-label="ファイルを削除"
          class="invisible absolute top-1 right-1 h-6 w-6 cursor-pointer group-hover:visible"
          type="button"
          @click="removeFile(index)">
          <XCircleIcon />
        </button>
        <span>{{ file.name }}</span>
      </div>
    </div>
  </div>
</template>
