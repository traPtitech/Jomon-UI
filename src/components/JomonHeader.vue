<script lang="ts" setup>
import { useRoute } from 'vue-router'

import HeaderButton from './HeaderButton.vue'
import Logo from './shared/JomonLogo.vue'
import UserIcon from './shared/UserIcon.vue'
import type { User } from '/@/lib/apis'
import { isAdmin } from '/@/lib/authorityCheck'

interface Props {
  me?: User
}

const props = defineProps<Props>()
const route = useRoute()

const hasAuthority = isAdmin(props.me)
</script>

<template>
  <header class="z-9999 fixed flex h-12 w-full items-center bg-white shadow">
    <router-link to="/">
      <logo />
    </router-link>
    <div class="flex h-full flex-1 justify-between px-2">
      <div class="flex items-center gap-2">
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
      </div>
      <user-icon v-if="me !== undefined" :name="me.name" />
    </div>
  </header>
</template>
