<script lang="ts" setup>
import { onMounted } from 'vue'

import { useToastStore } from '/@/stores/toast'

import ToastComponent from '/@/components/shared/ToastComponent.vue'

import JomonHeader from './components/JomonHeader.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

const toastStore = useToastStore()

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
    <ToastComponent v-show="toastStore.shouldShowToast" />
  </main>
  {{ toastStore.shouldShowToast }}
</template>
