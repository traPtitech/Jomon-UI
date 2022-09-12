<script lang="ts" setup>
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'

import HeaderButton from './HeaderButton.vue'
import SideDrawer from './SideDrawer.vue'
import ModalWrapper from './modal/ModalWrapper.vue'
import { useModal } from './modal/composables/useModal'
import Logo from './shared/JomonLogo.vue'
import UserIcon from './shared/UserIcon.vue'
import type { User } from '/@/lib/apis'
import { isAdmin } from '/@/lib/authorityCheck'

interface Props {
  me: User | undefined
}

const props = defineProps<Props>()
const route = useRoute()

const { shouldShowModal, openModal, closeModal } = useModal()

async function handleOpenDrawer() {
  if (!shouldShowModal.value) {
    openModal()
  } else {
    closeModal()
  }
}
</script>

<template>
  <header
    class="fixed flex h-12 w-full items-center bg-white pl-2 shadow"
    :class="shouldShowModal ? 'z-30' : 'z-10'">
    <button class="flex items-center md:hidden" @click="handleOpenDrawer">
      <bars3-icon class="h-8 w-8" />
    </button>
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
          v-if="isAdmin(props.me)"
          :is-here="route.fullPath === '/admins'"
          path="/admins"
          text="管理ページ" />
      </div>
      <user-icon :name="props.me?.name ?? 'traP'" />
    </div>
  </header>
  <!--遷移時にドロワーを閉じるようにするためにドロワーコンポーネント内でwrapperを使うことになりそう？-->
  <!--onBeforeRouteUpdateはヘッダーコンポーネントがルーター内に入っていないので使えない-->
  <modal-wrapper v-if="shouldShowModal" @close-modal="closeModal">
    <side-drawer />
  </modal-wrapper>
</template>
