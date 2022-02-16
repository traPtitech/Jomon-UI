<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useFileStore } from '../stores/file'

const fileStore = useFileStore()
const { files } = storeToRefs(fileStore)
</script>
<template>
  <!-- もうちょいいい感じにしたい -->
  <div class="w-3/7">
    <div v-if="files.length" class="mt-4 ml-4 mr-4 overflow-x-scroll flex">
      <img
        v-for="file in files"
        :key="file.file"
        alt="file.name"
        class="flex-shrink-0 w-1/2"
        :src="file.file"
      />
    </div>
    <div v-else class="text-center mr-auto ml-auto">画像はありません</div>
  </div>
</template>
