<script lang="ts" setup>
import { computed } from 'vue'

import ApplicationStatusChange from '/@/components/applicationDetail/ApplicationStatusChange.vue'
import ApplicationTitle from '/@/components/applicationDetail/ApplicationTitle.vue'
import type { ApplicationDetail } from '/@/features/application/entities'

const props = defineProps<{
  application: ApplicationDetail
}>()

const totalAmount = computed(() =>
  props.application.targets.reduce((a, target) => a + target.amount, 0)
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <ApplicationTitle :application="application" />
    <div class="flex items-center justify-between">
      <ApplicationStatusChange :application="application" />
      <div class="text-3xl font-bold">{{ totalAmount }}円</div>
    </div>
  </div>
</template>
