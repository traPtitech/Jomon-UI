<script lang="ts" setup>
import { useRoute } from 'vue-router'

import HeaderButton from './HeaderButton.vue'
import Logo from './shared/JomonLogo.vue'
import UserIcon from './shared/UserIcon.vue'
import type { User } from '/@/lib/apis'

interface Props {
  me: User
}
const route = useRoute()

defineProps<Props>()
</script>

<template>
  <header class="z-9999 fixed flex h-12 w-full items-center bg-white shadow">
    <router-link to="/">
      <Logo />
    </router-link>
    <div class="flex h-full flex-1 justify-between px-2">
      <div class="flex items-center gap-2">
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
          :is-here="route.fullPath === '/admins'"
          path="/admins"
          text="管理ページ" />
      </div>
      <UserIcon v-if="me.name" :name="me.name" />
    </div>
  </header>
</template>
