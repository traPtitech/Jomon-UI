<script lang="ts" setup>
import { XCircleIcon } from '@heroicons/vue/24/solid'

import apis from '/@/lib/apis'
import type { File } from '/@/pages/composables/requestDetail/useRequestFile'

interface Props {
  files: File[] | undefined
}

const props = defineProps<Props>()

async function deleteFile(id: string) {
  const result = confirm('この画像を削除しますか？')
  if (!result) {
    return
  }
  await apis.deleteFile(id)
}
</script>

<template>
  <div>
    <div v-if="props.files && props.files.length > 0" class="mx-4 mt-4">
      <details>
        <summary>画像</summary>
        <div class="flex flex-wrap">
          <div v-for="file in props.files" :key="file.file" class="relative">
            <img :alt="file.name" :src="file.file" />
            <button
              class="absolute top-0 right-0 h-6 w-6"
              @click="deleteFile(file.id)">
              <x-circle-icon />
            </button>
          </div>
        </div>
      </details>
    </div>
    <div v-else class="text-center">(画像はありません)</div>
  </div>
</template>
