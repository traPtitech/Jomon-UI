<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRequestDetailStore } from '../stores/requestDetail'
import RequestLog from './RequestLog.vue'
const requestDetailStore = useRequestDetailStore()
const { logs } = storeToRefs(requestDetailStore)
</script>

<template>
  <div class="w-3/10 h-140 border border-solid border-black">
    <h1 class="text-3xl text-center">ログ</h1>
    <ul>
      <li v-for="log in logs" :key="log.created_at.toDateString">
        <RequestLog :index="log.index" :kind="log.kind" />
      </li>
    </ul>
  </div>
</template>
