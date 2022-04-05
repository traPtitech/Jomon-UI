<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import Header from './components/Header.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
const { me } = storeToRefs(userStore)
const route = useRoute()
</script>

<template>
  <!--作成をやめますかみたいな確認画面出した方がいいかも-->
  <main class="h-screen">
    <Header :me="me" />

    <router-view :key="route.fullPath" /><!--ページング処理時の再描画を促す -->
  </main>
</template>
