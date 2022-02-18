<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useFileStore } from '../stores/file'

const fileStore = useFileStore()
const { files } = storeToRefs(fileStore)
</script>
<template>
  <div>
    <div v-if="files.length" class="mt-4 ml-4 mr-4 flex overflow-x-scroll">
      <img
        v-for="file in files"
        :key="file.file"
        alt="file.name"
        class="h-64"
        :src="file.file"
      />
    </div>
    <div v-else class="text-center mr-auto ml-auto">画像はありません</div>
  </div>
</template>
