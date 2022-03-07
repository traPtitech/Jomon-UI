<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import Icon from './components/Icon.vue'
import { useRequestStore } from './stores/request'
import { useUserStore } from './stores/user'
import Logo from '/@/components/Logo.vue'

const requestStore = useRequestStore()
const userStore = useUserStore()
const { isModalOpen, isModalOpen2 } = storeToRefs(requestStore)
const route = useRoute()
</script>
<template>
  <div
    :class="
      isModalOpen ? 'absolute h-screen w-screen z-2 bg-gray-500 opacity-50' : ''
    "
    @click="isModalOpen = false"
  ></div>
  <div
    :class="
      isModalOpen2
        ? 'absolute h-screen w-screen z-4 bg-gray-500 opacity-50'
        : ''
    "
    @click="isModalOpen2 = false"
  ></div>
  <!--作成をやめますかみたいな確認画面出した方がいいかも-->
  <main class="h-screen">
    <header class="flex shadow min-h-12 w-full items-center">
      <router-link to="/">
        <Logo />
      </router-link>
      <div class="flex flex-1 px-2 justify-between">
        <div class="flex gap-2 items-center">
          <router-link to="/requests?pageIndex=1"
            ><span>申請一覧</span></router-link
          >
          <router-link to="/transactions?pageIndex=1"
            ><span>入出金記録一覧</span></router-link
          >
          <router-link to="/groups"><span>グループ一覧</span></router-link>
        </div>
        <Icon :name="userStore.me.name" />
      </div>
    </header>

    <router-view :key="route.fullPath" /><!--ページング処理時の再描画を促す -->
  </main>
</template>
