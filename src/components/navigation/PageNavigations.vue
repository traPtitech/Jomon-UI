<script setup lang="ts">
import { useRoute } from 'vue-router'

import { useUserStore } from '/@/stores/user'

import HeaderButton from './HeaderButton.vue'

const { isAccountManager } = useUserStore()

const route = useRoute()
</script>

<template>
  <nav class="mx-2 flex flex-col gap-2 md:flex-row md:items-center">
    <HeaderButton
      :is-here="route.path === '/applications'"
      path="/applications"
      text="申請一覧" />
    <HeaderButton
      :is-here="route.path === '/partitions'"
      path="/partitions"
      text="パーティション一覧" />
    <HeaderButton
      v-if="isAccountManager"
      :is-here="route.path === '/account-managers'"
      path="/account-managers"
      text="管理ページ" />
  </nav>
</template>
