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
  <header class="flex h-12 shadow w-full items-center fixed bg-white z-9999">
    <router-link to="/">
      <Logo />
    </router-link>
    <div class="flex h-full flex-1 px-2 justify-between">
      <div class="flex gap-2 items-center">
        <HeaderButton
          :fullpath="route.fullPath"
          path="/requests"
          text="申請一覧" />
        <HeaderButton
          :fullpath="route.fullPath"
          path="/transactions"
          text="入出金記録一覧" />
        <HeaderButton
          :fullpath="route.fullPath"
          path="/groups"
          text="グループ一覧" />
        <HeaderButton
          :fullpath="route.fullPath"
          path="/admins"
          text="管理ページ" />
      </div>
      <UserIcon v-if="me.name" :name="me.name" />
    </div>
  </header>
</template>
