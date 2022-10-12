<script lang="ts" setup>
import { useUserStore } from '/@/stores/user'

import PageNavigations from './PageNavigations.vue'
import ModalWrapper from './modal/ModalWrapper.vue'
import { useModal } from './modal/composables/useModal'
import JomonLogo from './shared/JomonLogo.vue'
import UserIcon from './shared/UserIcon.vue'

const userStore = useUserStore()

const { shouldShowModal, openModal, closeModal } = useModal()

const handleOpenDrawer = () => {
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
      <JomonLogo />
    </router-link>
    <div class="flex h-full flex-1 justify-between px-2">
      <PageNavigations class="invisible md:visible" />
      <UserIcon v-if="userStore.me !== undefined" :name="userStore.me.name" />
    </div>
  </header>
  <!--遷移時にドロワーを閉じるようにするためにドロワーコンポーネント内でwrapperを使うことになりそう？-->
  <!--onBeforeRouteUpdateはヘッダーコンポーネントがルーター内に入っていないので使えない-->
  <ModalWrapper v-if="shouldShowModal" @close-modal="closeModal">
    <side-drawer />
  </ModalWrapper>
</template>
