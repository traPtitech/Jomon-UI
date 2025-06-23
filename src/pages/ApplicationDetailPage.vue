<script lang="ts" setup>
import { useRoute } from 'vue-router'

import { toId } from '/@/lib/parseQueryParams'

import ApplicationHeader from '/@/components/applicationDetail/ApplicationHeader.vue'
import ApplicationLogs from '/@/components/applicationDetail/ApplicationLogs.vue'
import ApplicationSidebar from '/@/components/applicationDetail/ApplicationSidebar.vue'
import { useFetchPartitionsUsecase } from '/@/features/partition/usecase'
import { useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'
import { useApplicationDetailStore } from '/@/stores/applicationDetail'
import { usePartitionStore } from '/@/stores/partition'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

const route = useRoute()
const id = toId(route.params.id)

const { isUserFetched } = useUserStore()
const { isPartitionFetched } = usePartitionStore()
const { isTagFetched } = useTagStore()
const { useApplication } = useApplicationDetailStore()

const application = await useApplication(id)

if (!isPartitionFetched.value) {
  await useFetchPartitionsUsecase()
}
if (!isUserFetched.value) {
  await useFetchUsersUsecase()
}
if (!isTagFetched.value) {
  await useFetchTagsUsecase()
}
</script>

<template>
  <div v-if="application !== undefined" class="flex flex-col gap-6">
    <ApplicationHeader :application="application" />
    <div class="h-px bg-[#e5e7eb]" />
    <div class="flex flex-col lg:flex-row justify-between gap-12">
      <ApplicationLogs class="lg:w-2/3" :application="application" />
      <ApplicationSidebar v-model="application" />
    </div>
  </div>
</template>
