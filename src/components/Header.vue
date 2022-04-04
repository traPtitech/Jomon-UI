<script lang="ts" setup>
import Logo from './shared/Logo.vue'
import UserIcon from './shared/UserIcon.vue'

type User = {
  name: string
  display_name: string
  admin: boolean
  created_at: string
  updated_at: string
  deleted_at: string
}
interface Props {
  me: User
}
const props = defineProps<Props>()
</script>

<template>
  <header class="flex shadow h-12 w-full items-center">
    <router-link to="/">
      <Logo />
    </router-link>
    <div class="flex flex-1 px-2 justify-between h-full">
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
        <router-link to="/admins" v-if="me.admin">
          <span>管理ページ</span>
        </router-link>
      </div>
      <UserIcon :name="me.name" />
    </div>
  </header>
</template>
