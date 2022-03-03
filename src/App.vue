<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import NewRequestButton from './components/NewRequestButton.vue'
import { useRequestStore } from './stores/request'
import Logo from '/@/components/Logo.vue'

const requestStore = useRequestStore()
const { isModalOpen } = storeToRefs(requestStore)
const route = useRoute()
</script>
<template>
  <div
    :class="
      isModalOpen ? 'absolute h-screen w-screen z-2 bg-gray-500 opacity-50' : ''
    "
    @click="isModalOpen = false"
  ></div>
  <!--作成をやめますかみたいな確認画面出した方がいいかも-->
  <main>
    <header class="flex shadow min-h-12 w-full items-center">
      <Logo />
      <div class="flex flex-1 px-2 justify-between">
        <div class="flex gap-2">
          <router-link to="/requests"><div>申請一覧</div></router-link>
          <router-link to="/transactions"
            ><div>入出金記録一覧</div></router-link
          >
          <router-link to="/groups?pageIndex=1"
            ><div>グループ一覧</div></router-link
          >
        </div>
        <NewRequestButton />
      </div>
    </header>

    <router-view :key="route.fullPath" />
  </main>
</template>
