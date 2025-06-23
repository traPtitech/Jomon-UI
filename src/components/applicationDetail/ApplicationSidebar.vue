<script lang="ts" setup>
import ApplicationPartition from '/@/components/applicationDetail/ApplicationPartition.vue'
import ApplicationTags from '/@/components/applicationDetail/ApplicationTags.vue'
import ApplicationTargets from '/@/components/applicationDetail/ApplicationTargets.vue'
import type { ApplicationDetail } from '/@/features/application/model'

const application = defineModel<ApplicationDetail>({ required: true })
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-3">
      <ApplicationPartition v-model="application" />
      <ApplicationTags v-model="application" />
    </div>
    <ApplicationTargets :application="application" />
  </div>
</template>
