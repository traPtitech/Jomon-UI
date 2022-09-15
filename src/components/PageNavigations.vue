<script setup lang="ts">
import { useRoute } from 'vue-router'

import HeaderButton from '/@/components/HeaderButton.vue'
import { isAdmin } from '/@/lib/authorityCheck'
import { useUserStore } from '/@/stores/user'

const userStore = useUserStore()

const route = useRoute()
const hasAuthority = isAdmin(userStore.me)
</script>

<template>
  <nav class="mx-2 flex flex-col gap-2 md:flex-row md:items-center">
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
      v-if="hasAuthority"
      :is-here="route.fullPath === '/admins'"
      path="/admins"
      text="管理ページ" />
  </nav>
</template>
