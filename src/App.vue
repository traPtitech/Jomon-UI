<script lang="ts" setup>
import { useRoute } from 'vue-router'

import Icon from './components/shared/Icon.vue'
import Logo from './components/shared/Logo.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
const route = useRoute()
</script>
<template>
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
          <router-link to="/groups?pageIndex=1"
            ><div>グループ一覧</div></router-link
          >
        </div>
        <Icon :name="userStore.me.name" />
      </div>
    </header>

    <router-view :key="route.fullPath" /><!--ページング処理時の再描画を促す -->
  </main>
</template>
