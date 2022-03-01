<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '../stores/requestDetail'
import NewComment from './NewComment.vue'
import RequestImage from './RequestImage.vue'
import RequestLog from './RequestLog.vue'

const requestDetailStore = useRequestDetailStore()
const { logs } = storeToRefs(requestDetailStore)
</script>

<template>
  <div class="w-2/3 h-120 mt-4 ml-12">
    <div class="overflow-y-scroll h-full">
      <RequestImage />
      <ul>
        <li v-for="log in logs" :key="log.created_at.toDateString">
          <RequestLog :index="log.index" :kind="log.kind" />
          <div class="h-8 w-1 bg-gray-300 ml-14"></div>
        </li>
      </ul>
    </div>
  </div>
</template>
