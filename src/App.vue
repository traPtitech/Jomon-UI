<script lang="ts" setup>
import { watch } from 'vue'

import { useRoute } from 'vue-router'

import { useUserStore } from '@/features/user/store'

import JomonHeader from './components/navigation/JomonHeader.vue'
import './styles/main.css'
import './styles/scrollbar.css'
import './styles/toast.css'

const route = useRoute()
const { fetchMe } = useUserStore()

watch(
  () => route.fullPath,
  async () => {
    try {
      await fetchMe()
    } catch {
      document.location = 'https://jomon-dev.trapti.tech/api/auth/genpkce'
    }
  },
  { immediate: true }
)
</script>

<template>
  <JomonHeader />
  <main class="min-h-screen bg-surface-primary pt-12 text-text-primary">
    <div class="mx-auto mt-8 w-5/6 pb-32 md:w-2/3">
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
    </div>
  </main>
</template>

<style>
.modal-container {
  cursor: default;
  z-index: 20;
}
</style>
