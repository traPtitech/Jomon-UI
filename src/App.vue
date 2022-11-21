<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter, RouterView } from 'vue-router'

import { useContextMenuStore } from '/@/stores/contextMenu'

import JomonHeader from './components/navigation/JomonHeader.vue'
import { useUserStore } from './stores/user'
import './styles/toast.css'

const router = useRouter()
const userStore = useUserStore()
const { handleCloseContextMenu } = useContextMenuStore()

router.beforeEach(() => {
  handleCloseContextMenu()
})

onMounted(async () => {
  await userStore.fetchMe()
})
</script>

<template>
  <div @click="handleCloseContextMenu">
    <JomonHeader />
    <main class="text-primary bg-background h-screen overflow-y-scroll pt-12">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <suspense>
            <template #default>
              <component :is="Component" />
            </template>
            <template #fallback>
              <div>loading...</div>
            </template>
          </suspense>
        </template>
      </RouterView>
    </main>
  </div>
  <!--以下がteleportされている-->
  <!--<ModalWrapper />-->
</template>

<style>
.modal-container {
  cursor: default;
  z-index: 20;
}
</style>
