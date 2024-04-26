<script lang="ts" setup>
import RequestGroup from '/@/components/requestDetail/RequestGroup.vue'
import RequestTags from '/@/components/requestDetail/RequestTags.vue'
import RequestTargets from '/@/components/requestDetail/RequestTargets.vue'
</script>

<template>
  <div class="px-4 flex flex-col gap-8">
    <div class="flex flex-col gap-3">
      <RequestGroup />
      <RequestTags />
    </div>
    <RequestTargets />
  </div>
</template>
