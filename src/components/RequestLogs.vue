<script lang="ts" setup>
import RequestImage from './RequestImage.vue'
import RequestLog from './RequestLog.vue'
import { useRequestDetailStore } from '/@/stores/requestDetail'

const requestDetailStore = useRequestDetailStore()
</script>

<template>
  <div class="w-2/3 h-120 mt-4 ml-12">
    <div class="overflow-y-scroll h-full">
      <RequestImage />
      <ul>
        <li
          v-for="log in requestDetailStore.logs"
          :key="log.created_at.toDateString">
          <RequestLog :index="log.index" :kind="log.kind" />
          <div class="h-7 w-1 bg-zinc-300 ml-15.5" />
        </li>
      </ul>
    </div>
  </div>
</template>
