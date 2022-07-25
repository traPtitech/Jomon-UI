<script lang="ts" setup>
import { container } from 'jenesius-vue-modal'

import JomonHeader from './components/JomonHeader.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
</script>

<template>
  <jomon-header :me="userStore.me" />
  <main class="text-dark-500 h-screen overflow-scroll bg-zinc-50 pt-12">
    <router-view />
  </main>
  <container />
</template>

<style>
.modal-container {
  cursor: default;
  z-index: 20;
}
</style>
