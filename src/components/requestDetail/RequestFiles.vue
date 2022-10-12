<script lang="ts" setup>
import { DocumentIcon } from '@heroicons/vue/24/outline'
import { XCircleIcon } from '@heroicons/vue/24/solid'

import apis from '/@/lib/apis'
import { isImageByName } from '/@/lib/checkFileType'

import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { File } from '/@/pages/composables/requestDetail/useRequestFile'

interface Props {
  files: File[] | undefined
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'removeFile', fileId: string): void
}>()

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
    emit('removeFile', id)
  } catch (err) {
    alert(err)
  }
}
</script>

<template>
  <div v-if="props.files && props.files.length > 0" class="mx-4 mt-4">
    <details>
      <summary>画像</summary>
      <div class="flex flex-wrap">
        <div
          v-for="file in props.files"
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
