<script lang="ts" setup>
import { type Ref, onUnmounted, ref, watch } from 'vue'

import { DocumentIcon } from '@heroicons/vue/24/outline'
import { XCircleIcon } from '@heroicons/vue/24/solid'

import { isImageByType } from '@/lib/checkFileType'

import type { FileSeed } from '@/features/file/entities'

const fileSeeds = defineModel<FileSeed[]>({ required: true })

const inputRef = ref()

function handleFileChange(e: Event) {
  if (!(e.target instanceof HTMLInputElement) || !e.target.files) {
    return
  }

  const newFileSeeds = Array.from(e.target.files).map(file => {
    return { name: file.name, file: file }
  })
  fileSeeds.value.push(...newFileSeeds)
  if (inputRef.value) {
    inputRef.value.value = null
  }
}

const useFilePreviewUrls = (fileSeeds: Ref<FileSeed[]>) => {
  const filePreviewUrls = ref(new Map<File, string>())

  watch(
    fileSeeds,
    newFileSeeds => {
      filePreviewUrls.value.forEach((previewUrl, file) => {
        if (!newFileSeeds.some(fileSeed => fileSeed.file === file)) {
          URL.revokeObjectURL(previewUrl)
          filePreviewUrls.value.delete(file)
        }
      })
      newFileSeeds.forEach(fileSeed => {
        const { file } = fileSeed
        if (!filePreviewUrls.value.has(file)) {
          const previewUrl = URL.createObjectURL(file)
          filePreviewUrls.value.set(file, previewUrl)
        }
      })
    },
    { deep: true, immediate: true }
  )

  function removeFile(file: File) {
    const previewUrl = filePreviewUrls.value.get(file)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    filePreviewUrls.value.delete(file)
    fileSeeds.value = fileSeeds.value.filter(fileSeed => fileSeed.file !== file)
  }

  onUnmounted(() => {
    filePreviewUrls.value.forEach(value => {
      URL.revokeObjectURL(value)
    })
    filePreviewUrls.value.clear()
  })

  return { filePreviewUrls, removeFile }
}

const { filePreviewUrls, removeFile } = useFilePreviewUrls(fileSeeds)
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
    <div v-if="fileSeeds.length === 0" class="text-sm font-medium">
      画像プレビュー
    </div>
    <div v-if="fileSeeds.length !== 0" class="flex flex-wrap">
      <div
        v-for="(fileSeed, index) in fileSeeds"
        :key="index"
        class="group relative flex flex-col items-center not-first:ml-2">
        <img
          v-if="isImageByType(fileSeed.file.type)"
          :alt="fileSeed.name"
          class="h-32"
          :src="filePreviewUrls.get(fileSeed.file)" />
        <DocumentIcon v-else class="h-32" />
        <button
          aria-label="ファイルを削除"
          class="invisible absolute top-1 right-1 h-6 w-6 cursor-pointer group-hover:visible"
          type="button"
          @click="removeFile(fileSeed.file)">
          <XCircleIcon />
        </button>
        <span>{{ fileSeed.name }}</span>
      </div>
    </div>
  </div>
</template>
