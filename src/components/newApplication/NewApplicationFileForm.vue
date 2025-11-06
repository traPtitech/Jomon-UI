<script lang="ts" setup>
import type { FileSeed } from '@/features/file/entities'
import { isImageByType } from '@/lib/checkFileType'
import { DocumentIcon } from '@heroicons/vue/24/outline'
import { XCircleIcon } from '@heroicons/vue/24/solid'
import { ref, watch } from 'vue'

const files = defineModel<FileSeed[]>({ required: true })

const inputRef = ref()
const filePreviewUrls = ref<string[]>([])

function handleFileChange(e: Event) {
  if (!(e.target instanceof HTMLInputElement) || !e.target.files) {
    return
  }

  const newFiles = Array.from(e.target.files).map(file => {
    return { name: file.name, file: file }
  })
  files.value.push(...newFiles)
  if (inputRef.value) {
    inputRef.value.value = null
  }
}

function removeFile(index: number) {
  files.value.splice(index, 1)
}

watch(
  files,
  async files => {
    filePreviewUrls.value = await Promise.all(
      files.map(({ file }) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        return new Promise<string>(resolve => {
          reader.onload = () => {
            resolve(reader.result as string)
          }
        })
      })
    )
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium" for="image">画像</label>
    <input
      id="image"
      ref="inputRef"
      multiple
      type="file"
      class="border-surface-secondary hover:bg-hover-primary focus:ring-accent-primary flex w-fit items-center rounded-md border px-2 py-1 focus:ring-2 focus:ring-offset-2"
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
        class="not-first:ml-2 group relative flex flex-col items-center">
        <img
          v-if="isImageByType(file.file.type)"
          :alt="file.name"
          class="h-32"
          :src="filePreviewUrls[index]" />
        <DocumentIcon v-else class="h-32" />
        <button
          aria-label="ファイルを削除"
          class="invisible absolute right-1 top-1 h-6 w-6 cursor-pointer group-hover:visible"
          type="button"
          @click="removeFile(index)">
          <XCircleIcon />
        </button>
        <span>{{ file.name }}</span>
      </div>
    </div>
  </div>
</template>
