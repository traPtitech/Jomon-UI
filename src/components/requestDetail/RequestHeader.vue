<script lang="ts" setup>
import { computed } from 'vue'

import type { ApplicationDetail } from '/@/features/request/model'
import RequestStatusChange from '/@/components/requestDetail/RequestStatusChange.vue'
import RequestTitle from '/@/components/requestDetail/RequestTitle.vue'

const props = defineProps<{
  request: ApplicationDetail
}>()

const totalAmount = computed(() =>
  props.request.targets.reduce((a, target) => a + target.amount, 0)
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <RequestTitle :request="request" />
    <div class="flex items-center justify-between">
      <RequestStatusChange :request="request" />
      <div class="text-3xl font-bold">{{ totalAmount }}円</div>
    </div>
  </div>
</template>
