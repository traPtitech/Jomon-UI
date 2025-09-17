<script lang="ts" setup>
import { DocumentIcon } from '@heroicons/vue/24/outline'
import { XCircleIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'

import { isImageByType } from '@/lib/checkFileType'

import type { FileSeed } from '@/features/file/entities'

interface Props {
  files: FileSeed[]
}

const props = defineProps<Props>()
const emit = defineEmits<(e: 'input', value: FileSeed[]) => void>()

const inputRef = ref()

function handleFileChange(e: Event) {
  if (!(e.target instanceof HTMLInputElement) || !e.target.files) {
    return
  }
  for (const file of Array.from(e.target.files)) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      emit('input', [
        ...props.files,
        { name: file.name, file: file } as FileSeed
      ])
    }
  }
  if (inputRef.value) {
    inputRef.value.value = null
  }
}

function removeFile(index: number) {
  emit(
    'input',
    props.files.filter((_, i) => index !== i)
  )
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
      class="flex w-fit items-center rounded-md border border-surface-secondary py-1 px-2 hover:bg-hover-primary focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
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
        class="not-first:ml-2 relative flex flex-col items-center group">
        <img
          v-if="isImageByType(file.file.type)"
          :alt="file.name"
          class="h-32"
          :src="file.name" />
        <DocumentIcon v-else class="h-32" />
        <button
          aria-label="ファイルを削除"
          class="absolute top-1 right-1 h-6 w-6 cursor-pointer invisible group-hover:visible"
          type="button"
          @click="removeFile(index)">
          <XCircleIcon />
        </button>
        <span>{{ file.name }}</span>
      </div>
    </div>
  </div>
</template>
