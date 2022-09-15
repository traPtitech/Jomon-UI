<script lang="ts" setup>
import { Bars3Icon } from '@heroicons/vue/24/outline'

import SideDrawer from './SideDrawer.vue'
import ModalWrapper from './modal/ModalWrapper.vue'
import { useModal } from './modal/composables/useModal'
import Logo from './shared/JomonLogo.vue'
import UserIcon from './shared/UserIcon.vue'
import PageNavigations from '/@/components/PageNavigations.vue'
import { useUserStore } from '/@/stores/user'

const userStore = useUserStore()

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
      <page-navigations class="invisible md:visible" />
      <user-icon :name="userStore.me.name ?? 'traP'" />
    </div>
  </header>
  <!--遷移時にドロワーを閉じるようにするためにドロワーコンポーネント内でwrapperを使うことになりそう？-->
  <!--onBeforeRouteUpdateはヘッダーコンポーネントがルーター内に入っていないので使えない-->
  <modal-wrapper v-if="shouldShowModal" @close-modal="closeModal">
    <side-drawer />
  </modal-wrapper>
</template>
