<script lang="ts" setup>
import { useFileStore } from '/@/stores/file'

const fileStore = useFileStore()
</script>
<template>
  <div>
    <div v-if="fileStore.files.length" class="mt-4 ml-4 mr-4">
      <details>
        <summary>画像</summary>
        <div class="flex flex-wrap">
          <img
            v-for="file in fileStore.files"
            :key="file.file"
            :alt="file.name"
            :src="file.file" />
        </div>
      </details>
    </div>
    <div v-else class="text-center">(画像はありません)</div>
  </div>
</template>
