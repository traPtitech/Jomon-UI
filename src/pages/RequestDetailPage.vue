<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import { toId } from '/@/lib/parseQueryParams'

import RequestLogs from '/@/components/requestDetail/RequestLogs.vue'
import RequestSidebar from '/@/components/requestDetail/RequestSidebar.vue'
import { useFetchGroupsUsecase } from '/@/features/group/usecase'
import { useFetchRequestUsecase } from '/@/features/request/usecase'
import { useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'
import RequestHeader from '/@/components/requestDetail/RequestHeader.vue'

const route = useRoute()
const id = toId(route.params.id)

const requestDetailStore = useRequestDetailStore()
const userStore = useUserStore()
const groupStore = useGroupStore()
const tagStore = useTagStore()
const { isUserFetched } = storeToRefs(userStore)
const { isGroupFetched } = storeToRefs(groupStore)
const { isTagFetched } = storeToRefs(tagStore)

const { request } = storeToRefs(requestDetailStore)

await useFetchRequestUsecase(id)
if (!isGroupFetched.value) {
  await useFetchGroupsUsecase()
}
if (!isUserFetched.value) {
  await useFetchUsersUsecase()
}
if (!isTagFetched.value) {
  await useFetchTagsUsecase()
}

onMounted(() => {
  if (route.hash !== '') {
    document.getElementById(route.hash.substring(1))?.scrollIntoView(true)
  }
})
</script>

<template>
  <div
    v-if="request !== undefined"
    class="mx-auto w-4/5 pt-5 flex flex-col gap-5">
    <RequestHeader :request="request" />
    <div class="h-0.25 bg-[#e5e7eb]" />
    <div class="flex justify-between gap-20">
      <RequestLogs class="basis-2/3" />
      <RequestSidebar class="basis-1/3" />
    </div>
  </div>
</template>
