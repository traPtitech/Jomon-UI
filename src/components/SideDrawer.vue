<script lang="ts" setup>
import { useRoute } from 'vue-router'

import HeaderButton from './HeaderButton.vue'

const route = useRoute()
</script>

<template>
  <div class="fixed left-0 top-12 h-full w-1/2 bg-white pt-4">
    <div class="flex flex-col gap-2 px-2">
      <header-button
        :is-here="route.fullPath === '/requests'"
        path="/requests"
        text="申請一覧" />
      <header-button
        :is-here="route.fullPath === '/transactions'"
        path="/transactions"
        text="入出金記録一覧" />
      <header-button
        :is-here="route.fullPath === '/groups'"
        path="/groups"
        text="グループ一覧" />
      <header-button
        :is-here="route.fullPath === '/admins'"
        path="/admins"
        text="管理ページ" />
    </div>
  </div>
</template>
