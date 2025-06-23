<script lang="ts" setup>
import { usePartitonDetailStore } from '/@/stores/partitonDetail'

const { partiton } = usePartitonDetailStore()
</script>

<template>
  <div v-if="partiton" class="flex flex-col gap-3">
    <h2 class="text-xl">予算</h2>
    <p>{{ partiton?.budget }} 円</p>
  </div>
</template>
