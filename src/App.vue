<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import Header from './components/Header.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
const { me } = storeToRefs(userStore)
</script>

<template>
  <Header :me="me" />
  <main class="text-dark-500 h-screen overflow-scroll pt-12">
    <router-view />
  </main>
</template>
