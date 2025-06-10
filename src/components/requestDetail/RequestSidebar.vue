<script lang="ts" setup>
import RequestGroup from '/@/components/requestDetail/RequestGroup.vue'
import RequestTags from '/@/components/requestDetail/RequestTags.vue'
import RequestTargets from '/@/components/requestDetail/RequestTargets.vue'
import type { RequestDetail } from '/@/features/request/model'

defineProps<{
  request: RequestDetail
}>()
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-3">
      <RequestGroup :request="request" />
      <RequestTags :request="request" />
    </div>
    <RequestTargets :request="request" />
  </div>
</template>
