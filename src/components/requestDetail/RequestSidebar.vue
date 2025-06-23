<script lang="ts" setup>
import RequestPartiton from '/@/components/requestDetail/RequestPartiton.vue'
import RequestTags from '/@/components/requestDetail/RequestTags.vue'
import RequestTargets from '/@/components/requestDetail/RequestTargets.vue'
import type { ApplicationDetail } from '/@/features/request/model'

const request = defineModel<ApplicationDetail>({ required: true })
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-3">
      <RequestPartiton v-model="request" />
      <RequestTags v-model="request" />
    </div>
    <RequestTargets :request="request" />
  </div>
</template>
