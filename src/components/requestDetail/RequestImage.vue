<script lang="ts" setup>
import apis from '/@/lib/apis'
import type { File } from '/@/stores/requestDetail'

interface Props {
  files: File[] | undefined
}

const props = defineProps<Props>()

async function deleteFile(id: string) {
  await apis.deleteFile(id)
}
</script>

<template>
  <div>
    <div v-if="props.files && props.files.length > 0" class="mx-4 mt-4">
      <details>
        <summary>画像</summary>
        <div class="flex flex-wrap">
          <img
            v-for="file in props.files"
            :key="file.file"
            :alt="file.name"
            :src="file.file" />
        </div>
      </details>
    </div>
    <div v-else class="text-center">(画像はありません)</div>
  </div>
</template>
