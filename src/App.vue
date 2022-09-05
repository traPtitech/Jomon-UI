<script lang="ts" setup>
import { onMounted } from 'vue'

import JomonHeader from './components/JomonHeader.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchMe()
})
</script>

<template>
  <suspense>
    <template #default>
      <jomon-header />
    </template>
    <template #fallback>
      <div class="h-12">loading...</div>
    </template>
  </suspense>
  <main class="text-primary h-screen overflow-y-scroll bg-zinc-50 pt-12">
    <suspense>
      <template #default>
        <router-view />
      </template>
      <template #fallback>
        <div class="text-3xl text-red-500">loading...</div>
      </template>
    </suspense>
  </main>
</template>
