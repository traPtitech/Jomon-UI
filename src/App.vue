<script lang="ts" setup>
import { onMounted } from 'vue'

import JomonHeader from './components/navigation/JomonHeader.vue'
import { useUserStore } from './stores/user'
import './styles/toast.css'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchMe()
})
</script>

<template>
  <JomonHeader />
  <main class="text-primary bg-background h-screen overflow-y-scroll pt-12">
    <router-view v-slot="{ Component }">
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
    </router-view>
  </main>
</template>

<style>
.modal-container {
  cursor: default;
  z-index: 20;
}
</style>
