<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import JomonHeader from './components/JomonHeader.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
const { me } = storeToRefs(userStore)
</script>

<template>
  <jomon-header :me="me" />
  <main class="text-dark-500 h-screen overflow-scroll pt-12">
    <router-view />
  </main>
</template>
