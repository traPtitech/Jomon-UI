<script lang="ts" setup>
import { onMounted } from 'vue'

import JomonHeader from './components/JomonHeader.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchMe()
})
</script>

<template>
  <jomon-header :me="userStore.me" />
  <main class="text-primary h-screen overflow-scroll bg-zinc-50 pt-12">
    <router-view />
  </main>
</template>

<style>
.modal-container {
  cursor: default;
  z-index: 20;
}
</style>
