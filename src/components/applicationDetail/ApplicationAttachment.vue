<script setup lang="ts">
import { useToast } from 'vue-toastification'

defineProps<{ files: string[] }>()
const toast = useToast()

const handleFileUpload = async () => {
  try {
    toast.success('ファイルを追加しました')
  } catch {
    toast.error('ファイルの追加に失敗しました')
  }
}
</script>

<template>
  <div class="m-3 overflow-auto">
    <div class="flex gap-3">
      <div v-for="file in files" :key="file">
        <a :href="'/files/' + file" :download="file">
          <div
            class="h-36 w-32 overflow-hidden rounded bg-surface-secondary"
            :model-value="file">
            <img
              v-if="file === 'image'"
              :alt="file"
              class="w-full object-cover"
              :src="'/files/' + file" />
          </div>
        </a>
        <p class="mt-2 text-center">{{ file }}</p>
      </div>
    </div>
    <div class="mt-3 flex gap-3">
      <div v-for="file in files" :key="file">
        <a :href="'/files/' + file" :download="file">
          <div
            class="h-60 w-96 overflow-hidden rounded bg-surface-secondary"
            :model-value="file">
            <img
              v-if="file === 'image'"
              :alt="file"
              class="w-full object-cover"
              :src="'/files/' + file" />
          </div>
        </a>
        <p class="mt-2">{{ file }}</p>
      </div>
    </div>
  </div>
  <div class="flex justify-end">
    <label
      class="flex cursor-pointer items-center rounded-md border border-surface-secondary px-4 py-2 hover:bg-hover-primary"
      for="file_upload">
      添付ファイルを追加
      <input
        id="file_upload"
        class="hidden"
        type="file"
        @change="handleFileUpload" />
    </label>
  </div>
</template>
