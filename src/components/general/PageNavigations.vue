<script setup lang="ts">
import { useRoute } from 'vue-router'

import { useUserStore } from '/@/stores/user'

import HeaderButton from './HeaderButton.vue'

const userStore = useUserStore()

const route = useRoute()
</script>

<template>
  <nav class="mx-2 flex flex-col gap-2 md:flex-row md:items-center">
    <HeaderButton
      :is-here="route.fullPath === '/requests'"
      path="/requests"
      text="申請一覧" />
    <HeaderButton
      :is-here="route.fullPath === '/transactions'"
      path="/transactions"
      text="入出金記録一覧" />
    <HeaderButton
      :is-here="route.fullPath === '/groups'"
      path="/groups"
      text="グループ一覧" />
    <HeaderButton
      v-if="userStore.isAdmin()"
      :is-here="route.fullPath === '/admins'"
      path="/admins"
      text="管理ページ" />
  </nav>
</template>
