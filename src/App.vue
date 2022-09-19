<script lang="ts" setup>
import { onMounted } from 'vue'

import ToastComponent from '/@/components/shared/ToastComponent.vue'
import { useToast } from '/@/components/shared/composables/useToast'

import JomonHeader from './components/JomonHeader.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

const { shouldShowToast, toastType, toastMessage, showToast } = useToast()

onMounted(async () => {
  await userStore.fetchMe()
})
</script>

<template>
  <JomonHeader />
  <main class="text-primary bg-background h-screen overflow-y-scroll pt-12">
    <router-view v-slot="{ Component }" @show-toast="showToast($event)">
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
    <ToastComponent
      v-show="shouldShowToast"
      :should-show-toast="shouldShowToast"
      :type="toastType"
      @remove="shouldShowToast = false">
      {{ toastMessage }}
    </ToastComponent>
  </main>
</template>
