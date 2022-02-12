<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import RequestDetail from '../components/RequestDetail.vue'
import RequestLogs from '../components/RequestLogs.vue'
import { useRequestDetailStore } from '../stores/requestDetail'
const requestDetailStore = useRequestDetailStore()
const route = useRoute()
const id = route.params.id
onMounted(() => {
  requestDetailStore.getRequestDetail(id)
})
</script>

<template>
  <div class="flex justify-around mt-4">
    <RequestDetail />
    <RequestLogs />
  </div>
</template>
