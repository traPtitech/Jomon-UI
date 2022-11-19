<script lang="ts" setup>
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/solid'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import { toId } from '/@/lib/parseQueryParams'

import ContextMenu from '/@/components/requestDetail/ContextMenu.vue'
import NewComment from '/@/components/requestDetail/NewComment.vue'
import RequestDetail from '/@/components/requestDetail/RequestDetail.vue'
import RequestDetailEdit from '/@/components/requestDetail/RequestDetailEdit.vue'
import RequestLogs from '/@/components/requestDetail/RequestLogs.vue'
import RequestTitle from '/@/components/requestDetail/RequestTitle.vue'
//import StatusChangeForm from '/@/components/requestDetail/StatusChangeForm.vue'
import StatusChip from '/@/components/shared/StatusChip.vue'

import { useRequestDetail } from './composables/useRequestDetail'

const route = useRoute()
const id = toId(route.params.id)

const requestDetailStore = useRequestDetailStore()
const userStore = useUserStore()
const groupStore = useGroupStore()
const tagStore = useTagStore()

const { isEditMode, changeEditMode } = useRequestDetail()
const { request } = storeToRefs(requestDetailStore)

const isContextMenuOpen = ref(false)
const handleToggleContextMenu = () => {
  isContextMenuOpen.value = !isContextMenuOpen.value
}

await requestDetailStore.fetchRequestDetail(id)
if (!groupStore.isGroupFetched) {
  await groupStore.fetchGroups()
}
if (!userStore.isUserFetched) {
  await userStore.fetchUsers()
}
if (!tagStore.isTagFetched) {
  await tagStore.fetchTags()
}
</script>

<template>
  <div v-if="request !== undefined" class="min-w-100 mx-auto w-4/5 px-12 pt-4">
    <div class="bottom-bar">
      <div class="relative flex items-center justify-between">
        <StatusChip
          :has-select-menu="requestDetailStore.canChangeStatus(userStore.me)"
          has-text
          :status="request.status" />
        <!-- todo:StatusChangeFormを置く -->
        <RequestTitle
          class="ml-2"
          :is-edit-mode="isEditMode"
          @change-edit-mode="changeEditMode($event)" />
        <button v-if="!isEditMode" @click="handleToggleContextMenu">
          <EllipsisHorizontalIcon class="w-10" />
        </button>
        <ContextMenu
          v-if="isContextMenuOpen"
          class="absolute right-6 top-6"
          @change-edit-mode="changeEditMode($event)"
          @close-menu="isContextMenuOpen = false" />
      </div>
      <RequestDetail v-if="!isEditMode" />
      <RequestDetailEdit v-else @change-edit-mode="changeEditMode($event)" />
    </div>
    <div>
      <RequestLogs class="w-3/4" />
      <NewComment class="mb-12" />
    </div>
  </div>
</template>

<style scoped>
.bottom-bar::after {
  content: '';
  display: block;
  border: 1px solid #e5e7eb;
  margin: 12px auto;
  background-color: #e5e7eb;
}
</style>
