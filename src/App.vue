<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import Header from './components/Header.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
const { me } = storeToRefs(userStore)
</script>

<template>
  <main class="h-screen">
    <Header :me="me" />

    <router-view />
  </main>
</template>
