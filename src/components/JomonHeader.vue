<script lang="ts" setup>
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { openModal } from 'jenesius-vue-modal'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import HeaderButton from './HeaderButton.vue'
import SideDrawer from './SideDrawer.vue'
import Logo from './shared/JomonLogo.vue'
import UserIcon from './shared/UserIcon.vue'
import type { User } from '/@/lib/apis'

interface Props {
  me: User
}
const route = useRoute()
const drawer = ref()

async function handleOpenDrawer() {
  if (!drawer.value || drawer.value.closed) {
    drawer.value = await openModal(SideDrawer)
  } else {
    drawer.value.close()
  }
}
defineProps<Props>()
</script>

<template>
  <header
    class="fixed flex h-12 w-full items-center bg-white pl-2 shadow"
    :class="drawer ? 'z-30' : 'z-10'">
    <bars3-icon class="h-8 w-8 md:hidden" @click="handleOpenDrawer" />
    <router-link to="/">
      <logo />
    </router-link>
    <div class="flex h-full flex-1 justify-between px-2">
      <div class="invisible flex items-center gap-2 md:visible">
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
      <user-icon :name="me.name" />
    </div>
  </header>
</template>
