<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import Header from './components/Header.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
const { me } = storeToRefs(userStore)
</script>

<template>
  <Header :me="me" />
  <main class="h-screen bg-zinc-50 pt-12 text-dark-500 overflow-scroll">
    <router-view />
  </main>
</template>
