<script lang="ts" setup>
import Logo from './shared/JomonLogo.vue'
import UserIcon from './shared/UserIcon.vue'
import type { User } from '/@/lib/apis'

interface Props {
  me: User
}
defineProps<Props>()
</script>

<template>
  <header class="flex h-12 shadow w-full items-center">
    <router-link to="/">
      <Logo />
    </router-link>
    <div class="flex h-full flex-1 px-2 justify-between">
      <div class="flex gap-2 items-center">
        <router-link to="/requests?pageIndex=1">
          <span>申請一覧</span>
        </router-link>
        <router-link to="/transactions?pageIndex=1">
          <span>入出金記録一覧</span>
        </router-link>
        <router-link to="/groups?pageIndex=1">
          <span>グループ一覧</span>
        </router-link>
        <router-link v-if="me.admin" to="/admins">
          <span>管理ページ</span>
        </router-link>
      </div>
      <UserIcon :name="me.name!" />
    </div>
  </header>
</template>
