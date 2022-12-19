<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useRequestDetailStore } from '/@/stores/requestDetail'

const requestDetailStore = useRequestDetailStore()

const { request } = storeToRefs(requestDetailStore)

const totalAmount = computed(
  () => request.value?.targets.reduce((a, target) => a + target.amount, 0) ?? 0
)
</script>

<template>
  <div v-if="request" class="flex items-center">
    <span class="text-2xl">金額：{{ totalAmount }}円</span>
  </div>
</template>
