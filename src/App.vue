<script lang="ts" setup>
import { onMounted, watch } from 'vue'

import { useFetchMeUsecase } from '/@/features/user/usecase'

import JomonHeader from './components/navigation/JomonHeader.vue'
import './styles/main.css'
import './styles/scrollbar.css'
import './styles/toast.css'
import { useRoute } from 'vue-router'

onMounted(async () => {
  await useFetchMeUsecase()
})

const route = useRoute()

watch(
  () => route.fullPath,
  async () => {
    try {
      await useFetchMeUsecase()
    } catch {
      document.location = 'https://jomon-dev.trapti.tech/api/auth/genpkce'
    }
  }
)
</script>

<template>
  <JomonHeader />
  <main class="text-text-primary bg-primary h-screen overflow-y-scroll pt-12">
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
