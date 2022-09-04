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
      <jomon-header :me="userStore.me" />
    </template>
    <template #fallback>
      <jomon-header />
    </template>
  </suspense>
  <main class="text-primary h-screen overflow-scroll bg-zinc-50 pt-12">
    <suspense>
      <template #default>
        <router-view />
      </template>
      <template #fallback>
        <div>loading...</div>
      </template>
    </suspense>
  </main>
</template>
