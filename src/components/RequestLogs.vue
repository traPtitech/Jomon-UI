<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '../stores/requestDetail'
import NewComment from './NewComment.vue'
import RequestLog from './RequestLog.vue'

const requestDetailStore = useRequestDetailStore()
const { logs } = storeToRefs(requestDetailStore)
</script>

<template>
  <div class="w-4/7 h-120 mt-4 ml-12">
    <ul class="overflow-y-scroll h-90">
      <li v-for="log in logs" :key="log.created_at.toDateString">
        <RequestLog :index="log.index" :kind="log.kind" />
      </li>
    </ul>
    <NewComment />
  </div>
</template>
