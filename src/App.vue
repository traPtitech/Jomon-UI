<script lang="ts" setup>
import { onMounted } from 'vue'

import { useFetchMeUsecase } from '/@/features/user/usecase'

import JomonHeader from './components/navigation/JomonHeader.vue'
import './styles/main.css'
import './styles/toast.css'

onMounted(async () => {
  await useFetchMeUsecase()
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
