<script lang="ts" setup>
import { RouterLink } from 'vue-router'

import { Bars3Icon } from '@heroicons/vue/24/outline'

import ModalWrapper from '@/components/modal/ModalWrapper.vue'
import { useModal } from '@/components/modal/composables/useModal'
import JomonLogo from '@/components/shared/JomonLogo.vue'

import LoggedInUserIcon from './LoggedInUserIcon.vue'
import LoggedInUserSelector from './LoggedInUserSelector.vue'
import PageNavigations from './PageNavigations.vue'
import SideDrawer from './SideDrawer.vue'

const { shouldShowModal, openModal, closeModal } = useModal()

const isDevEnvironment = import.meta.env.MODE === 'development'

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
      aria-label="メニューを開く"
      :aria-expanded="shouldShowModal"
      aria-controls="side-drawer"
      @click="handleOpenDrawer">
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
        <LoggedInUserSelector v-if="isDevEnvironment">
          <LoggedInUserIcon />
        </LoggedInUserSelector>
        <LoggedInUserIcon v-else />
      </div>
    </div>
  </header>
  <!--遷移時にドロワーを閉じるようにするためにドロワーコンポーネント内でwrapperを使うことになりそう？-->
  <!--onBeforeRouteUpdateはヘッダーコンポーネントがルーター内に入っていないので使えない-->
  <ModalWrapper v-if="shouldShowModal" @close-modal="closeModal">
    <SideDrawer id="side-drawer" />
  </ModalWrapper>
</template>
