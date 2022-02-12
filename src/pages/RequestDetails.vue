<script lang="ts" setup>
import { useRoute } from 'vue-router'
import RequestDetail from '../components/RequestDetail.vue'
import RequestLogs from '../components/RequestLogs.vue'
const route = useRoute()
const id = route.params.id
</script>
// idを使ってGETリクエストを飛ばす

<template>
  <div class="flex justify-around">
    <RequestDetail />
    <RequestLogs />
  </div>
</template>
