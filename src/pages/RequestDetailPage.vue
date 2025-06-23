<script lang="ts" setup>
import { useRoute } from 'vue-router'

import { toId } from '/@/lib/parseQueryParams'

import RequestHeader from '/@/components/requestDetail/RequestHeader.vue'
import RequestLogs from '/@/components/requestDetail/RequestLogs.vue'
import RequestSidebar from '/@/components/requestDetail/RequestSidebar.vue'
import { useFetchPartitionsUsecase } from '/@/features/partition/usecase'
import { useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'
import { usePartitionStore } from '/@/stores/partition'
import { useTagStore } from '/@/stores/tag'

const route = useRoute()
const id = toId(route.params.id)

const { isUserFetched } = useUserStore()
const { isPartitionFetched } = usePartitionStore()
const { isTagFetched } = useTagStore()
const { useRequest } = useRequestDetailStore()

const request = await useRequest(id)

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
  <div v-if="request !== undefined" class="flex flex-col gap-6">
    <RequestHeader :request="request" />
    <div class="h-px bg-[#e5e7eb]" />
    <div class="flex flex-col lg:flex-row justify-between gap-12">
      <RequestLogs class="lg:w-2/3" :request="request" />
      <RequestSidebar v-model="request" />
    </div>
  </div>
</template>
