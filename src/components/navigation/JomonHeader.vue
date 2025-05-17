<script lang="ts" setup>
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

import { useUserStore } from '/@/stores/user'

import ModalWrapper from '/@/components/modal/ModalWrapper.vue'
import { useModal } from '/@/components/modal/composables/useModal'
import JomonLogo from '/@/components/shared/JomonLogo.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'

import PageNavigations from './PageNavigations.vue'
import SideDrawer from './SideDrawer.vue'

const userStore = useUserStore()

const { me } = storeToRefs(userStore)

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
    class="fixed flex h-12 w-full items-center bg-white pl-2 shadow-sm"
    :class="shouldShowModal ? 'z-30' : 'z-10'">
    <button 
      class="flex items-center md:hidden" 
      @click="handleOpenDrawer"
      aria-label="メニューを開く"
      :aria-expanded="shouldShowModal"
      aria-controls="side-drawer">
      <Bars3Icon class="h-8 w-8" aria-hidden="true" />
    </button>
    <RouterLink to="/" aria-label="ホーム" tabindex="0">
      <JomonLogo />
    </RouterLink>
    <div class="flex h-full flex-1 justify-between px-2">
      <PageNavigations class="invisible md:visible" />
      <div class="flex items-center gap-2">
        <a
          href="https://wiki.trap.jp/services/Jomon"
          rel="noreferrer noopener"
          target="_blank"
          tabindex="0">
          ヘルプ
        </a>
        <UserIcon v-if="me !== undefined" :name="me.name" />
      </div>
    </div>
  </header>
  <!--遷移時にドロワーを閉じるようにするためにドロワーコンポーネント内でwrapperを使うことになりそう？-->
  <!--onBeforeRouteUpdateはヘッダーコンポーネントがルーター内に入っていないので使えない-->
  <ModalWrapper v-if="shouldShowModal" @close-modal="closeModal">
    <SideDrawer id="side-drawer" />
  </ModalWrapper>
</template>
