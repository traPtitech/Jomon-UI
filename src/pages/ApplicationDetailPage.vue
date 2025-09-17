<script lang="ts" setup>
import ApplicationHeader from '@/components/applicationDetail/ApplicationHeader.vue'
import ApplicationLogs from '@/components/applicationDetail/ApplicationLogs.vue'
import ApplicationSidebar from '@/components/applicationDetail/ApplicationSidebar.vue'
import { useApplicationStore } from '@/features/application/store'
import { usePartitionStore } from '@/features/partition/store'
import { useTagStore } from '@/features/tag/store'
import { useUserStore } from '@/features/user/store'
import { toId } from '@/lib/parseQueryParams'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = toId(route.params.id)

const { currentApplication: application, ensureApplication } =
  useApplicationStore()
const { isPartitionFetched, fetchPartitions } = usePartitionStore()
const { isUserFetched, fetchUsers } = useUserStore()
const { isTagFetched, fetchTags } = useTagStore()

await ensureApplication(id)

if (!isPartitionFetched.value) {
  await fetchPartitions()
}
if (!isUserFetched.value) {
  await fetchUsers()
}
if (!isTagFetched.value) {
  await fetchTags()
}
</script>

<template>
  <div
    v-if="application !== undefined && application !== null"
    class="flex flex-col gap-6">
    <ApplicationHeader :application="application" />
    <div class="h-px bg-[#e5e7eb]" />
    <div class="flex flex-col lg:flex-row justify-between gap-12">
      <ApplicationLogs
        class="order-2 lg:order-1 lg:w-2/3"
        :application="application" />
      <ApplicationSidebar v-model="application" class="order-1 lg:order-2" />
    </div>
  </div>
</template>
