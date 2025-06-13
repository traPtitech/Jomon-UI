<script lang="ts" setup>
import { useGroupDetailStore } from '/@/stores/groupDetail'

const { group } = useGroupDetailStore()
</script>

<template>
  <div v-if="group" class="flex flex-col gap-3">
    <h2 class="text-xl">予算</h2>
    <p>{{ group?.budget }} 円</p>
  </div>
</template>
