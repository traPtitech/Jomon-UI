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
    class="fixed flex h-12 w-full items-center bg-white pl-2 shadow"
    :class="shouldShowModal ? 'z-30' : 'z-10'">
    <button class="flex items-center md:hidden" @click="handleOpenDrawer">
      <Bars3Icon class="h-8 w-8" />
    </button>
    <RouterLink to="/">
      <JomonLogo />
    </RouterLink>
    <div class="flex h-full flex-1 justify-between px-2">
      <PageNavigations class="invisible md:visible" />
      <UserIcon v-if="me !== undefined" :name="me.name" />
    </div>
  </header>
  <!--遷移時にドロワーを閉じるようにするためにドロワーコンポーネント内でwrapperを使うことになりそう？-->
  <!--onBeforeRouteUpdateはヘッダーコンポーネントがルーター内に入っていないので使えない-->
  <ModalWrapper v-if="shouldShowModal" @close-modal="closeModal">
    <SideDrawer />
  </ModalWrapper>
</template>
