<script lang="ts" setup>
import { useRoute } from 'vue-router'

import NewRequestButton from './components/NewRequestButton.vue'
import Logo from '/@/components/Logo.vue'

const route = useRoute()
</script>
<template>
  <main>
    <header class="flex shadow min-h-12 w-full items-center">
      <router-link to="/"
        ><!--Jomonという文字のロゴも入れたい-->
        <Logo />
      </router-link>
      <div class="flex flex-1 px-2 justify-between">
        <div class="flex gap-2">
          <router-link to="/requests?pageIndex=1"
            ><div>申請一覧</div></router-link
          >
          <router-link to="/transactions"
            ><div>入出金記録一覧</div></router-link
          >
          <router-link to="/groups"><div>グループ一覧</div></router-link>
        </div>
        <NewRequestButton />
      </div>
    </header>

    <router-view :key="route.fullPath" /><!--ページング処理時の再描画を促す -->
  </main>
</template>
