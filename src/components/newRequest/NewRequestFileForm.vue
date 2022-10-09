<script lang="ts" setup>
import { DocumentIcon } from '@heroicons/vue/24/outline'
import { XCircleIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'

import { isImageByType } from '/@/lib/checkFileType'
import type { FileRequest } from '/@/pages/NewRequestPage.vue'

interface Props {
  files: FileRequest[]
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'input', value: FileRequest[]): void }>()

const inputRef = ref()

function handleFileChange(e: Event) {
  if (!(e.target instanceof HTMLInputElement) || !e.target.files) {
    return
  }
  for (let i = 0; i < e.target.files.length; i++) {
    const file = e.target.files[i]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      emit('input', [
        ...props.files,
        { name: file.name, src: reader.result as string, type: file.type }
      ])
    }
  }
  if (inputRef.value) {
    inputRef.value.value = null
  }
}

function deleteFile(index: number) {
  emit(
    'input',
    props.files.filter((_, i) => index !== i)
  )
}
</script>

<template>
  <div class="flex flex-col">
    <label>画像</label>
    <input ref="inputRef" multiple type="file" @change="handleFileChange" />
  </div>
  <div>
    <div v-if="files.length === 0">画像プレビュー</div>
    <div v-if="files.length !== 0" class="flex flex-wrap">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="not-first:ml-2 relative flex w-32 flex-col items-center text-center">
        <img
          v-if="isImageByType(file.type)"
          :alt="file.name"
          class="w-full"
          :src="file.src" />
        <document-icon v-else class="w-full" />
        <button
          class="absolute top-0 right-0 h-6 w-6"
          @click="deleteFile(index)">
          <x-circle-icon />
        </button>
        <span class="w-full truncate">{{ file.name }}</span>
      </div>
    </div>
  </div>
</template>
