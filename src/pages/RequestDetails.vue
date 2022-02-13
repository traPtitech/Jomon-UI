<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import RequestDetail from '../components/RequestDetail.vue'
import RequestLogs from '../components/RequestLogs.vue'
import { useFileStore } from '../stores/file'
import { useRequestDetailStore } from '../stores/requestDetail'
const requestDetailStore = useRequestDetailStore()
const { request } = storeToRefs(requestDetailStore)
const fileStore = useFileStore()
const route = useRoute()
const id = route.params.request_id.toString()
onMounted(() => {
  requestDetailStore.getRequestDetail(id)
  fileStore.getFile(request.value.files)
})
</script>

<template>
  <div class="flex justify-around mt-4">
    <RequestDetail />
    <RequestLogs />
  </div>
</template>
