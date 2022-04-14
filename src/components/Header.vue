<script lang="ts" setup>
import { useRoute } from 'vue-router'

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
  <header class="flex h-12 shadow w-full items-center fixed">
    <router-link to="/">
      <Logo />
    </router-link>
    <div class="flex h-full flex-1 px-2 justify-between">
      <div class="flex gap-2 items-center">
        <router-link
          :class="route.fullPath === '/requests' ? 'cursor-default' : ''"
          to="/requests">
          <div
            class="p-2 rounded-3xl"
            :class="
              route.fullPath === '/requests'
                ? 'bg-zinc-200'
                : 'hover:bg-zinc-200'
            ">
            <span>申請一覧</span>
          </div>
        </router-link>
        <router-link
          :class="route.fullPath === '/transactions' ? 'cursor-default' : ''"
          to="/transactions">
          <div
            class="p-2 rounded-3xl"
            :class="
              route.fullPath === '/transactions'
                ? 'bg-zinc-200'
                : 'hover:bg-zinc-200'
            ">
            <span>入出金記録一覧</span>
          </div>
        </router-link>
        <router-link
          :class="route.fullPath === '/groups' ? 'cursor-default' : ''"
          to="/groups">
          <div
            class="p-2 rounded-3xl"
            :class="
              route.fullPath === '/groups' ? 'bg-zinc-200' : 'hover:bg-zinc-200'
            ">
            <span>グループ一覧</span>
          </div>
        </router-link>
        <router-link
          v-if="me.admin"
          :class="route.fullPath === '/admins' ? 'cursor-default' : ''"
          to="/admins">
          <div
            class="p-2 rounded-3xl"
            :class="
              route.fullPath === '/admins' ? 'bg-zinc-200' : 'hover:bg-zinc-200'
            ">
            <span>管理ページ</span>
          </div>
        </router-link>
      </div>
      <UserIcon v-if="me.name" :name="me.name" />
    </div>
  </header>
</template>
