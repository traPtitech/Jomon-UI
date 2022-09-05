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
  <JomonHeader />
  <main class="text-primary h-screen overflow-y-scroll bg-zinc-50 pt-12">
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
